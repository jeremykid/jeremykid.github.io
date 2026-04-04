---
title: "Permutation-Importance"
date: 2019-02-26T00:41:01.000Z
slug: "permutation-Importance"
summary: "Intro 简介 One of the most basic questions we might ask of a model is What features have the biggest impact on predictions? 在数据模型中有一个很基础的问题：哪一个特征对预测结果影响最大。 This concept is called feature impor..."
tags: []
legacyPath: "/2019/02/26/permutation-Importance/"
legacyTopLevelPaths: []
legacyTagSlugs: []
---
## Intro 简介

One of the most basic questions we might ask of a model is What features have the biggest impact on predictions?

在数据模型中有一个很基础的问题：哪一个特征对预测结果影响最大。

This concept is called feature importance. I've seen feature importance used effectively many times for every purpose in the list of use cases above.

这种概念被叫做特征重要性（我觉得跟特征选择或者特征工程这一系列的概念有联系。）根据以往经验，特征重要性这个概念被很有效的利用在跟中不同的项目上。

There are multiple ways to measure feature importance. Some approaches answer subtly different versions of the question above. Other approaches have documented shortcomings.

有许多种可以测量特征重要性的方法，有一些方法对问题有不同的解释方法，其他的方法有明显的缺点。（总而言之没有一种万能的方法）

In this lesson, we'll focus on permutation importance. Compared to most other approaches, permutation importance is:

在这门课中，我们会介绍交换排列计算重要性的方法。对比其他方法，交换排列计算重要性可以

Fast to calculate

更快计算

Widely used and understood

应用更普遍

Consistent with properties we would want a feature importance measure to have

保持特征重要性测量的一致性


## How it Works 应用

Permutation importance uses models differently than anything you've seen so far, and many people find it confusing at first. So we'll start with an example to make it more concrete.

交换排列计算重要性和我们之前见到的用model的方法不一样，一开始很多人都会觉得这个很难懂。所以我们会举一个例子让这个更具体，更容易让人接受。

Consider data with the following format:


![](https://i.imgur.com/wjMAysV.png)

We want to predict a person's height when they become 20 years old, using data that is available at age 10.

我们想用这些人在十岁的数据来越策他们20岁的身高。

Our data includes useful features (height at age 10), features with little predictive power (socks owned), as well as some other features we won't focus on in this explanation.

我们的数据包括很多很有用的特征比如10岁的身高，以及一些很弱的特征，比如他们拥有多少袜子，以及其他，我们并不详述。


**Permutation importance is calculated after a model has been fitted.** So we won't change the model or change what predictions we'd get for a given value of height, sock-count, etc.

交换排列计算重要性在训练数据之后被计算。所以我们并不会更改数据或是更改预测结果。

Instead we will ask the following question: If I randomly shuffle a single column of the validation data, leaving the target and all other columns in place, how would that affect the accuracy of predictions in that now-shuffled data?

相反我们会问以下的问题，如果我让一列随机排列这些预测数据，然后让其他的数据，特征量都不变，然后比较与原结果有多少准确度上的不同。

![](https://i.imgur.com/h17tMUU.png)

Randomly re-ordering a single column should cause less accurate predictions, since the resulting data no longer corresponds to anything observed in the real world. Model accuracy especially suffers if we shuffle a column that the model relied on heavily for predictions. In this case, shuffling height at age 10 would cause terrible predictions. If we shuffled socks owned instead, the resulting predictions wouldn't suffer nearly as much.

当我们随机重新排列期中一列上的数据，往往会带来更低准确度的预测，因为这个数据和真实世界并不符合。准确度会根据重新排列的那一行对结果影响的权重而降低不同级别。于是我们知道如果重新排列10岁身高哪一行会带来更差的结果预测。如果我们重新排列拥有袜子数量那一列，并不会对结果有多少影响。

With this insight, the process is as follows:

根据我们的观察，过程应该是

1. Get a trained model

得到一个训练好的模型

2. Shuffle the values in a single column, make predictions using the resulting dataset. Use these predictions and the true target values to calculate how much the loss function suffered from shuffling. That performance deterioration measures the importance of the variable you just shuffled.

随机排列单独一列的数据，然后来预测结果。通过损失函数来计算有多接近原来的结果。根据我们之前所推论的比较原有结果，表现越差的就代表这个特征对结果正面影响越大。

3. Return the data to the original order (undoing the shuffle from step 2.) Now repeat step 2 with the next column in the dataset, until you have calculated the importance of each column.

然后还原数据，重复第2步直到我们计算出所有特征的结果影响的重要性。

## Code Example

Our example will use a model that predicts whether a soccer/football team will have the "Man of the Game" winner based on the team's statistics. The "Man of the Game" award is given to the best player in the game. Model-building isn't our current focus, so the cell below loads the data and builds a rudimentary model.

关于预测足球队里谁能得到足球先生的预测。


```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

data = pd.read_csv('../input/fifa-2018-match-statistics/FIFA 2018 Statistics.csv')
y = (data['Man of the Match'] == "Yes")  # Convert from string "Yes"/"No" to binary
feature_names = [i for i in data.columns if data[i].dtype in [np.int64]]
X = data[feature_names]
train_X, val_X, train_y, val_y = train_test_split(X, y, random_state=1)
my_model = RandomForestClassifier(random_state=0).fit(train_X, train_y)

```

Here is how to calculate and show importances with the eli5 library:

```python
import eli5
from eli5.sklearn import PermutationImportance

perm = PermutationImportance(my_model, random_state=1).fit(val_X, val_y)
eli5.show_weights(perm, feature_names = val_X.columns.tolist())
```


## Interpreting Permutation Importances 解释交换排列计算重要性

The values towards the top are the most important features, and those towards the bottom matter least.

在这张图中 最上面的是最重要的特征，反之最下面的是最不重要的特征。

The first number in each row shows how much model performance decreased with a random shuffling (in this case, using "accuracy" as the performance metric).

每一行中的第一个数字显示在一个随机排列之后整个模型的准确度下降了多少。

Like most things in data science, there is some randomness to the exact performance change from a shuffling a column. We measure the amount of randomness in our permutation importance calculation by repeating the process with multiple shuffles. The number after the ± measures how performance varied from one-reshuffling to the next.

和许多在数据科学中发生的事情类似，有很多随机的事情会在随机排列一个特征列的时候发生，我们可以增加随机性通过更多次的随机排列。毕竟每次的随机排列都不会得到同样的结果。

You'll occasionally see negative values for permutation importances. In those cases, the predictions on the shuffled (or noisy) data happened to be more accurate than the real data. This happens when the feature didn't matter (should have had an importance close to 0), but random chance caused the predictions on shuffled data to be more accurate. This is more common with small datasets, like the one in this example, because there is more room for luck/chance.

有时候你甚至很偶然的可以得到一些负值（意思是随机排列那一列的时候准确度反而上升了）。这种情况往往是因为这个被随机排列这里一列本身就是一些无用的数据。当你用更大的数据去训练，这种幸运也会越来越难发生。

In our example, the most important feature was Goals scored. That seems sensible. Soccer fans may have some intuition about whether the orderings of other variables are surprising or not.

在我们的例子中，最重要的特征是进球得分。这非常合理，球迷还是很理性的会把进球数当作选足球先生第一个的参考值。


## Reference

[https://www.kaggle.com/dansbecker/permutation-importance](https://www.kaggle.com/dansbecker/permutation-importance)
