---
title: "Install python library"
date: 2018-05-24T23:01:30.000Z
slug: "Install-python-library"
summary: "Pyenv 因为之前用 node 的版本管理器 所以pyenv 应该也是python 的版本管理器 运行 curl L https://github.com/pyenv/pyenv installer/raw/master/bin/pyenv installer | bash 然后打开 vim /.bash profile 添加了三行 export PATH=\" /.pyenv..."
tags:
  - "python"
legacyPath: "/2018/05/24/Install-python-library/"
legacyTopLevelPaths: []
legacyTagSlugs: []
---
# Pyenv

因为之前用[nvm](https://github.com/creationix/nvm) node 的版本管理器

所以pyenv 应该也是python 的版本管理器

运行 curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash

然后打开 vim ~/.bash_profile 

添加了三行

  export PATH="~/.pyenv/bin:$PATH"
  eval "$(pyenv init -)"
  eval "$(pyenv virtualenv-init -)"

我原来的是

  export XAMPP_HOME=/Applications/xampp/xamppfiles
  export PATH=${XAMPP_HOME}/bin:${PATH}

最后变成

  export XAMPP_HOME=/Applications/xampp/xamppfiles
  export PATH=/Users/weijiesun/.pyenv/bin:${PATH}:${XAMPP_HOME}/bin

  eval "$(pyenv init -)"
  eval "$(pyenv virtualenv-init -)"

然后有个坑踩了好久，就是XAMPP_HOME=/Applications/xampp/xamppfiles 要放在path 的最后一位，不然就是疯狂在找http url 的端口

然后运行 

  source ~/.bash_profile   

就好了

Cheating sheet：[reference](https://github.com/eteplus/blog/issues/4)

- 安装和查看pyenv 和 python

  #查看pyenv版本
  pyenv --version

  #查看可用的python version
  pyenv versions

  #用pyenv 安装python 
  pyenv install 3.6.3

- 设置 python version

  # 对所有的Shell全局有效，会把版本号写入到~/.pyenv/version文件中
  pyenv global 3.6.3

  # 只对当前目录有效，会在当前目录创建.python-version文件
  pyenv local 3.6.3

  # 只在当前会话有效
  pyenv shell 3.6.3

我在安装的时候遇到了一下描述的问题

  Last 10 log lines:   File "/private/var/folders/py/3006ng_x6x3g5c42jx_gznlc0000gn/T/python-build.20180618223416.3806/Python-3.6.3/Lib/ensurepip/__main__.py", line 4, in <module>     ensurepip._main()

[解决方法](http://www.cnblogs.com/mingaixin/p/6295799.html)


# Kears

  # GPU 版本
  >>> pip install --upgrade tensorflow-gpu

  # CPU 版本
  >>> pip install --upgrade tensorflow

  # Keras 安装
  >>> pip install keras -U --pre

  import keras
  #然后就显示tensorflow work on backend

# pyecharts

[github pyecharts](https://github.com/pyecharts/pyecharts)

```
  $ pip install pyecharts


  $ pip install echarts-countries-pypkg
  $ pip install echarts-china-provinces-pypkg
  $ pip install echarts-china-cities-pypkg
  $ pip install echarts-china-counties-pypkg
  $ pip install echarts-china-misc-pypkg
```
$ pip install echarts-united-kingdom-pypkg
