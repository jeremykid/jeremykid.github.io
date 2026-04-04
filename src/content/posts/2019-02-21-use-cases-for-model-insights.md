---
title: "Use Cases for Model Insights"
date: 2019-02-21T00:30:11.000Z
slug: "Use-Cases-for-Model-Insights"
summary: "Use Cases for Model Insights 在data sciense 里用到的直觉 Debugging Information Feature engineering Directing future data collection Informing human decision making Building Trust 建立信任 Debugging The..."
tags: []
legacyPath: "/2019/02/21/Use-Cases-for-Model-Insights/"
legacyTopLevelPaths: []
legacyTagSlugs: []
---
Use Cases for Model Insights

在data sciense 里用到的直觉

- Debugging 

- Information Feature engineering 

- Directing future data collection

- Informing human decision-making

- Building Trust 建立信任


### Debugging

The world has a lot of unreliable, disorganized and generally dirty data. You add a potential source of errors as you write preprocessing code. Add in the potential for target leakage and it is the norm rather than the exception to have errors at some point in a real data science projects.

这个世界有许多不现实的，没有很好组织的，普遍的脏数据。当你对代码进行预处理的时候，你要去做一些规则去预防数据上潜在的错误，以及Data Leakage（Data Leakage一些不能用的数据，但是强行用了，使因果关系颠倒）。在真实的数据科学项目上，我们都应该提前制定规则去预防而不是在训练中或者结束用一些exception去去除。

Given the frequency and potentially disastrous consequences of bugs, debugging is one of the most valuable skills in data science. Understanding the patterns a model is finding will help you identify when those are at odds with your knowledge of the real world, and this is typically the first step in tracking down bugs.


考虑到这些数据bug经常会引起一系列的灾难，debugging 在数据科学中是最有价值的技能之一。你需要理解这个数据模型以及一部分真实世界的常识去作为定位bug的第一步 

### Informing Feature Engineering

Feature engineering is usually the most effective way to improve model accuracy. Feature engineering usually involves repeatedly creating new features using transformations of your raw data or features you have previously created.

特征上的分析运算往往是加强数据模型最有效的方法。Feature Engineering包括重复不停去利用这些特征做一些变化组合来得到新的特征

Sometimes you can go through this process using nothing but intuition about the underlying topic. But you'll need more direction when you have 100s of raw features or when you lack background knowledge about the topic you are working on.

有时候你只要用你对某一领域或者课题的直觉，但是当你缺少这个领域的知识的时候且有很多特征量，你需要试验更多的方向。

A Kaggle competition to predict loan defaults gives an extreme example. This competition had 100s of raw features. For privacy reasons, the features had names like f1, f2, f3 rather than common English names. This simulated a scenario where you have little intuition about the raw data.

有一个kaggle 的竞赛去预测loan defaults（默认贷款之类的），给了一个极端的例子。这次竞赛有一百个原始特征，但是由于一些隐私问题，所有的特征都被命名为f1,f2,f3, 而不是常规的特征名字。这个时候就模拟了一种你并不拥有原始数据的背景知识的情况。

One competitor found that the difference between two of the features, specificallyf527 - f528, created a very powerful new feature. Models including that difference as a feature were far better than models without it. But how might you think of creating this variable when you start with hundreds of variables?

有一个参赛者发现有两个特征的差，尤其是f527 - f528，这个差值或者创造的新的特征对结果的影响非常大。但是这也只能说是一个巧合当你需要去分析成百上千的特征

The techniques you'll learn in this course would make it transparent that f527 and f528 are important features, and that their role is tightly entangled. This will direct you to consider transformations of these two variables, and likely find the "golden feature" of f527 - f528.

你从这门课程学到的技巧可以更轻易的分辨出f527 和  f528 是非常重要的特征。并且他们的角色是互相纠缠影响的。这个方向就有利于我们去思考怎么对这两个特征进行变形，然后有可能我们就可以发现那种极品的特征 比如f527 - f528 

As an increasing number of datasets start with 100s or 1000s of raw features, this approach is becoming increasingly important.

随着特征量的增加从100 到1000 数量级，这个方法变得尤为重要。


### Directing Future Data Collection

对收集新数据的指向

You have no control over datasets you download online. But many businesses and organizations using data science have opportunities to expand what types of data they collect. Collecting new types of data can be expensive or inconvenient, so they only want to do this if they know it will be worthwhile. Model-based insights give you a good understanding of the value of features you currently have, which will help you reason about what new values may be most helpful.

我们并不能控制我们从网上下载的数据库。但是很多公司或者一些机构会利用数据科学找机会去拓展一部分新数据，当然刚开始获取新数据的代价是非常高的。所以他们往往需要模型结构的帮助去分辨获取新数据是否值得，以及新的数据能给整个项目带来多大的变化。

### Informing Human Decision-Making

一些人类的决定

Some decisions are made automatically by models. Amazon doesn't have humans (or elves) scurry to decide what to show you whenever you go to their website. But many important decisions are made by humans. For these decisions, insights can be more valuable than predictions.

模型会自动做出一些决定。Amazon 并没有神仙来时时刻刻决定你到Amazon网站看到了神马。但是很多重要的决定还是由人类决定，直觉有的时候比机器预测做出更有价值的决定。

### Building Trust

建立信任

Many people won't assume they can trust your model for important decisions without verifying some basic facts. This is a smart precaution given the frequency of data errors. In practice, showing insights that fit their general understanding of the problem will help build trust, even among people with little deep knowledge of data science.

许多人并不依靠我们的模型去做一些重要的决定，如果我们的模型没办法符合很基础的事实。人类本能就会预防一些未知的错误，包括数据的错误。在测试中，我们会用直觉去理解这个问题，让整个数据结构变得合理并却让一些没有数据科学训练的人也容易接受。


Reference:

[https://www.kaggle.com/dansbecker/use-cases-for-model-insights](https://www.kaggle.com/dansbecker/use-cases-for-model-insights)
