---
title: "Machine Learning Notes - 1"
date: 2018-05-20T16:15:11.000Z
slug: "Machine-Learning-Notes-1"
summary: "Reference: Todo List [X] 01 Overview P1 15 Machine learning background and flow P16 42 Machine learning flow [ ] 02 Business Understanding [X] 03 Data Understanding p56 62 To learn about dat..."
tags:
  - "Machine_Learning"
legacyPath: "/2018/05/20/Machine-Learning-Notes-1/"
legacyTopLevelPaths: []
legacyTagSlugs: []
---
Reference: [https://zhuanlan.zhihu.com/p/36287950](https://zhuanlan.zhihu.com/p/36287950)

# Todo List
- [X] - 01 - Overview
P1-15 Machine learning background and flow

P16-42  Machine learning flow

- [ ] - 02 - Business Understanding 

- [X] - 03 - Data Understanding p56 - 62

 To learn about data analysis, it is right that each of us try many things that do not work – that we tackle more problems than we make expert analyses of. We often learn less from an expertly done analysis than from one where, by not trying something, we missed an opportunity to learn more

- [ ] - 04 - Data Preparation -p63

Prepare data is time consuming 

several methods to deal with missing data and outliers

normalize Data

Data binning 分级

Reduce Data, Clean Data

Feature Engineering: 从raw data 提取出 feature

### Feature Selection: Filter/Wrapper/Embedded method

Traditional approaches 传统方法

#### Forward selection 

一开始模型里面没有variable， 然后往里面加入variable，直到accuracy 没有任何的增长

#### Backward elimination

和前一种相反，一开始有所有的variable, 然后去除，直到accuracy 有明显的下降

#### Stepwise regression

这种是用在选k-best feature， 一开始有k个，然后加入更好的，并且去除最差的，直到经历过所有的feature
  
P100
