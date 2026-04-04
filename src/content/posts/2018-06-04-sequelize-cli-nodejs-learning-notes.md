---
title: "sequelize cli NodeJs Learning Notes"
date: 2018-06-04T00:52:04.000Z
slug: "sequelize-cli-NodeJs-Learning-Notes"
summary: "Sequlize cli 是一个后端对象控制的一个library Introduce 首先要install： npm install save sequelize cli 然后init： node modules/.bin/sequelize init 如果你是用Mac 你可以重命名 sequelize: alias sequelize='node modules/.bin/s..."
tags:
  - "NodeJs"
legacyPath: "/2018/06/04/sequelize-cli-NodeJs-Learning-Notes/"
legacyTopLevelPaths: []
legacyTagSlugs: []
---
Sequlize cli 是一个后端对象控制的一个library

## Introduce

首先要install： npm install --save sequelize-cli

然后init： node_modules/.bin/sequelize init

如果你是用Mac 你可以重命名 sequelize:  alias sequelize='node_modules/.bin/sequelize'

设置 config/config.json 基本上就是列出 database的schema username password 之类的

## Migration

一种是create migration by model 

  node_modules/.bin/sequelize model:generate --name User

还有一种是直接create migration

  node_modules/.bin/sequelize migration:create --name add-wechatid-in-user

## Seed

在数据库里生成一些demo 或者 测试dat啊

生成 demo-user 的 seed 

  node_modules/.bin/sequelize seed:generate --name demo-user

在seeder 文件里

  'use strict';
  module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [{
          firstName: 'John',
          lastName: 'Doe',
          email: 'demo@demo.com'
        }], {});
    },

    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
    }
  };


Reference： 

[Sequelize 手册](http://docs.sequelizejs.com/manual/tutorial/migrations.html)
