---
title: "partial-plots"
date: 2019-03-14T21:46:58.000Z
slug: "partial-plots"
summary: "Partial Dependence Plots 部分特征图 While feature importance shows what variables most affect predictions, partial dependence plots show how a feature affects predictions. 当特征重要性显示出哪一个特征对预测结果影响最大..."
tags: []
legacyPath: "/2019/03/14/partial-plots/"
legacyTopLevelPaths: []
legacyTagSlugs: []
---
## Partial Dependence Plots

部分特征图

While feature importance shows what variables most affect predictions, partial dependence plots show how a feature affects predictions.

当特征重要性显示出哪一个特征对预测结果影响最大，部分特征图显示出一个特征如何影响预测结果。

This is useful to answer questions like:

这对回答以下问题非常有帮助。

Controlling for all other house features, what impact do longitude and latitude have on home prices? To restate this, how would similarly sized houses be priced in different areas?

在其他特征都相同的情况下，经纬度是如何影响房价? 换句话说在不同的地区，相同的房子的价格是如何不同的?

Are predicted health differences between two groups due to differences in their diets, or due to some other factor?

两个人群中，健康因素是由于饮食不同而变化，还是由于其他因素?

If you are familiar with linear or logistic regression models, partial dependence plots can be interepreted similarly to the coefficients in those models. Though, partial dependence plots on sophisticated models can capture more complex patterns than coefficients from simple models. If you aren't familiar with linear or logistic regressions, don't worry about this comparison.

如果你对线性回归或者逻辑回归模型熟悉的话，部分特征图可以解释为这些模型特征前面的系数。但是部分特征图可以解决更复杂的模型，而不局限于只是简单模型中的系数。如果你不熟悉线性回归或者逻辑回归模型，也不必担心。

We will show a couple examples, explain the interpretation of these plots, and then review the code to create these plots.

我们会展示几个案例，然后去解释这些图形包括生成这些图形的代码。

## How it Works

如何运行

Like permutation importance, **partial dependence plots are calculated after a model has been fit**. The model is fit on real data that has not been artificially manipulated in any way.

和排列重要性类似，部分特征图也必须在模型训练结束之后开始计算。这个模型必须完全基于真实数据（不能有人为的更改）。

In our soccer example, teams may differ in many ways. How many passes they made, shots they took, goals they scored, etc. At first glance, it seems difficult to disentangle the effect of these features.

在我们的足球例子中，每个足球队都有很多方面不同。比如多少次传球，射门，得分等。一开始，我们会觉得很难去解开每个特征对结果的影响。

To see how partial plots separate out the effect of each feature, we start by considering a single row of data. For example, that row of data might represent a team that had the ball 50% of the time, made 100 passes, took 10 shots and scored 1 goal.

我们可以从一条数据开始去了解部分特征图如何去解决每个特征的影响的。比如这一条数据，这个队伍控球50%，传了100次，射了10次门，并且得了1分。

We will use the fitted model to predict our outcome (probability their player won "man of the game"). But we **repeatedly alter the value for one variable** to make a series of predictions. We could predict the outcome if the team had the ball only 40% of the time. We then predict with them having the ball 50% of the time. Then predict again for 60%. And so on. We trace out predicted outcomes (on the vertical axis) as we move from small values of ball possession to large values (on the horizontal axis).

我们会用训练好的模型去预测结果(大概是哪位队员会赢得本场比赛的mvp)。但是我们重复改变其中的一个特征来得出一系列预测。我们可以预测如果一个队只控球40%比赛时间。我们继续预测如果一个队只控球50%比赛时间，然后预测60%，以此类推。我们把预测结果放Y轴，然后我们在X轴上把控球从小往大移动。

In this description, we used only a single row of data. Interactions between features may cause the plot for a single row to be atypical. So, we repeat that mental experiment with multiple rows from the original dataset, and we plot the average predicted outcome on the vertical axis.

解释中我们只用了一条数据。得出来的结果并不是最典型的。所以我们重复这种思想实验并且更改原来的数据。我们可以画出预测结果的平均数在Y轴上。

## Code Example

Model building isn't our focus, so we won't focus on the data exploration or model building code.


```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier

data = pd.read_csv('../input/fifa-2018-match-statistics/FIFA 2018 Statistics.csv')
y = (data['Man of the Match'] == "Yes")  # Convert from string "Yes"/"No" to binary
feature_names = [i for i in data.columns if data[i].dtype in [np.int64]]
X = data[feature_names]
train_X, val_X, train_y, val_y = train_test_split(X, y, random_state=1)
tree_model = DecisionTreeClassifier(random_state=0, max_depth=5, min_samples_split=5).fit(train_X, train_y)
```

For the sake of explanation, our first example uses a Decision Tree which you can see below. In practice, you'll use more sophistated models for real-world applications.

我们的第一个例子用了决策树。在现实中你会遇到更复杂的模型。

```python
from sklearn import tree
import graphviz

tree_graph = tree.export_graphviz(tree_model, out_file=None, feature_names=feature_names)
graphviz.Source(tree_graph)
```

![](https://github.com/jeremykid/DeepLearningCollection/blob/master/kaggleMachineLearningExplainability/kaggle-tree-model.PNG)

As guidance to read the tree:

- Leaves with children show their splitting criterion on the top
- The pair of values at the bottom show the count of True values and False values for the target respectively, of data points in that node of the tree.

为了更方便去理解决策树

- 叶子上面的解释了如何从顶端分离下来的标准
- 在最底部上面的值表示了正确还是错误的个数分别有多少

Here is the code to create the Partial Dependence Plot using the [PDPBox library](https://pdpbox.readthedocs.io/en/latest/).

```python
from matplotlib import pyplot as plt
from pdpbox import pdp, get_dataset, info_plots

# Create the data that we will plot
pdp_goals = pdp.pdp_isolate(model=tree_model, dataset=val_X, model_features=feature_names, feature='Goal Scored')

# plot it
pdp.pdp_plot(pdp_goals, 'Goal Scored')
plt.show()
```

![](https://www.kaggleusercontent.com/kf/11288908/eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0.._dosnOD29hmblI0rPpZ9Fg.5HDj6AQnNoxlE5PbQ9Mfivauaw1WrhDKjIDIjiT9-BBMs1QOzTXjive3fDbhBoNhekFCSk8AmOMYPNy-KxYfzMyy6tzSbfCdSDxq3RXZra9b_GMuVKLCpRaUldrx1XBgV30JslMOTVDj8_hqKtcNig.09rA0kMSSDQS8Fb-mOgw6Q/__results___files/__results___7_0.png)

Here is another example plot:

```
from matplotlib import pyplot as plt
from pdpbox import pdp, get_dataset, info_plots

# Create the data that we will plot
pdp_goals = pdp.pdp_isolate(model=tree_model, dataset=val_X, model_features=feature_names, feature='Goal Scored')

# plot it
pdp.pdp_plot(pdp_goals, 'Goal Scored')
plt.show()
```

A few items are worth pointing out as you interpret this plot

- The y axis is interpreted as **change in the prediction** from what it would be predicted at the baseline or leftmost value.

- A blue shaded area indicates level of confidence

有一些值得在你图上解释的点：

- Y 轴被解释成从baseline 或者最左边的值开始 预测上的变量

- 蓝色阴影代表了不同程度的置信区间

From this particular graph, we see that scoring a goal substantially increases your chances of winning "Player of The Game." But extra goals beyond that appear to have little impact on predictions.

从这一部分的图，我们不难发现进球得分基本上会增加你得本场比赛MVP的概率。但是多出来的进球反而对增加这个概率帮助并不是太大。

Here is another example plot:

```
feature_to_plot = 'Distance Covered (Kms)'
pdp_dist = pdp.pdp_isolate(model=tree_model, dataset=val_X, model_features=feature_names, feature=feature_to_plot)

pdp.pdp_plot(pdp_dist, feature_to_plot)
plt.show()
```

![](https://www.kaggleusercontent.com/kf/11288908/eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0.._dosnOD29hmblI0rPpZ9Fg.5HDj6AQnNoxlE5PbQ9Mfivauaw1WrhDKjIDIjiT9-BBMs1QOzTXjive3fDbhBoNhekFCSk8AmOMYPNy-KxYfzMyy6tzSbfCdSDxq3RXZra9b_GMuVKLCpRaUldrx1XBgV30JslMOTVDj8_hqKtcNig.09rA0kMSSDQS8Fb-mOgw6Q/__results___files/__results___9_0.png)

This graph seems too simple to represent reality. But that's because the model is so simple. You should be able to see from the decision tree above that this is representing exactly the model's structure.

You can easily compare the structure or implications of different models. Here is the same plot with a Random Forest model.

这个图看起来吧现实解释得很简单。但是这是因为模型简单。你应该去关注这个是如何解释模型结构的而不局限在决策树。

你可以很容易得比较不同模型。这里是随机森林模型的图。

```
# Build Random Forest model
rf_model = RandomForestClassifier(random_state=0).fit(train_X, train_y)

pdp_dist = pdp.pdp_isolate(model=rf_model, dataset=val_X, model_features=feature_names, feature=feature_to_plot)

pdp.pdp_plot(pdp_dist, feature_to_plot)
plt.show()
```

![](https://www.kaggleusercontent.com/kf/11288908/eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0.._dosnOD29hmblI0rPpZ9Fg.5HDj6AQnNoxlE5PbQ9Mfivauaw1WrhDKjIDIjiT9-BBMs1QOzTXjive3fDbhBoNhekFCSk8AmOMYPNy-KxYfzMyy6tzSbfCdSDxq3RXZra9b_GMuVKLCpRaUldrx1XBgV30JslMOTVDj8_hqKtcNig.09rA0kMSSDQS8Fb-mOgw6Q/__results___files/__results___11_0.png)

This model thinks you are more likely to win Player of The Game if your players run a total of 100km over the course of the game. Though running much more causes lower predictions.

In general, the smooth shape of this curve seems more plausible than the step function from the Decision Tree model. Though this dataset is small enough that we would be careful in how we interpret any model.

在这个模型中，你会更倾向于整场比赛跑了超过100km的队员得MVP，其实这个是比较低准确率的预测。

普遍来说，这种平稳的图形比决策树模型更加模糊。我们得非常小心去解释一些小数据模型

2D Partial Dependence Plots

2维的部分特征图

If you are curious about interactions between features, 2D partial dependence plots are also useful. An example may clarify what this.

We will again use the Decision Tree model for this graph. It will create an extremely simple plot, but you should be able to match what you see in the plot to the tree itself.

如果你对特征之间如何互相影响有兴趣的话，2维的部分特征图会非常有帮助。这里有一个例子可以解释这个。

我们会重复使用决策树模型。它会创造一个简单的图形，虽然简单，但是足够我们去对比到决策树图形本身。

```
# Similar to previous PDP plot except we use pdp_interact instead of pdp_isolate and pdp_interact_plot instead of pdp_isolate_plot
features_to_plot = ['Goal Scored', 'Distance Covered (Kms)']
inter1  =  pdp.pdp_interact(model=tree_model, dataset=val_X, model_features=feature_names, features=features_to_plot)

pdp.pdp_interact_plot(pdp_interact_out=inter1, feature_names=features_to_plot, plot_type='contour')
plt.show()
```

![](https://www.kaggleusercontent.com/kf/11288908/eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0.._dosnOD29hmblI0rPpZ9Fg.5HDj6AQnNoxlE5PbQ9Mfivauaw1WrhDKjIDIjiT9-BBMs1QOzTXjive3fDbhBoNhekFCSk8AmOMYPNy-KxYfzMyy6tzSbfCdSDxq3RXZra9b_GMuVKLCpRaUldrx1XBgV30JslMOTVDj8_hqKtcNig.09rA0kMSSDQS8Fb-mOgw6Q/__results___files/__results___13_0.png)

This graph shows predictions for any combination of Goals Scored and Distance covered.

For example, we see the highest predictions when a team scores at least 1 goal and they run a total distance close to 100km. If they score 0 goals, distance covered doesn't matter. Can you see this by tracing through the decision tree with 0 goals?

But distance can impact predictions if they score goals. Make sure you can see this from the 2D partial dependence plot. Can you see this pattern in the decision tree too?

图形展示了所有的得分与跑动距离的组合。

比如说我们看到最有可能得mvp的是至少进一个球并且跑步距离接近100km。如果他们得0分的话, 那么跑动距离将没有意义。你能在决策树上去搜索得分0吗？

一旦他们得分了，那么跑动距离将会影响结果。在2维的部分特征图上你能看到这些，你是否也能在决策树上找到这个呢？

[https://www.kaggle.com/dansbecker/partial-plots](https://www.kaggle.com/dansbecker/partial-plots)
