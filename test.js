/*!
 * Copyright(c) 2015-2016 wangqingmeng
 * A JavaScript utility used to build actual strings via an Object
 * @module:
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var _      = require("underscore");
var assert = require("assert");
var sqlobj = require('./index');

/**
 * Module variables.
 * @private
 */

var should = function(func, param, expected) {
    it('should return "' + expected + '" when the param is ' + JSON.stringify(param), function() {
        assert.equal(func(param), expected);
    });
};

/**
 *  process
 */

//------------------------------------------------------------------------------
// SELECT
//------------------------------------------------------------------------------
describe('SELECT:', function() {
    describe('--sqlobj.select(select)', function() {
        var func = sqlobj.select;
        var params = [{
            expected: ' *',
            param: ''
        }, {
            expected: ' *',
            param: null
        }, {
            expected: ' *',
            param: undefined
        }, {
            expected: ' *',
            param: '*'
        }, {
            expected: ' id, name',
            param: 'id, name'
        }, {
            expected: ' *',
            param: []
        }, {
            expected: ' id, name',
            param: ['id', 'name']
        }, {
            expected: ' user.id AS uid, user.name AS uname',
            param: ['user.id AS uid', 'user.name AS uname']
        }, {
            expected: ' *',
            param: {}
        }, {
            expected: ' user.*',
            param: {
                user: ''
            }
        }, {
            expected: ' user.*',
            param: {
                user: null
            }
        }, {
            expected: ' user.*',
            param: {
                user: undefined
            }
        }, {
            expected: ' user.*',
            param: {
                user: '*'
            }
        }, {
            expected: ' user.id, user.name',
            param: {
                user: 'id, name'
            }
        }, {
            expected: ' user.*, artilce.id, artilce.link',
            param: {
                user: [],
                artilce: ['id', 'link']
            }
        }, {
            expected: ' user.*, artilce.id, artilce.link, goods.id, goods.number',
            param: {
                user: {},
                artilce: ['id', 'link'],
                goods: ['id', 'number']
            }
        }];

        _.each(params, function(value, key, list){
            should(func, value.param, value.expected);
        });
    });
});

//------------------------------------------------------------------------------
// INSERT INTO
//------------------------------------------------------------------------------
describe('INSERT INTO:', function() {
    describe('--sqlobj.insert(insert)', function() {
        var func = sqlobj.insert;
        var params = [{
            expected: " user",
            param: 'user'
        }, {
            expected: " user (`id`, `user`, `article`) VALUES ('1', '111', '123'), ('2', '223', '333'), ('3', '222', '444')",
            param: ['user', ['id', 'user', 'article'], [1, 111, 123], [2, 223, 333], [3, 222, 444]]
        }, {
            expected: " user (`id`, `user`, `article`) VALUES ('1', '111', '123'), ('2', '223', '333'), ('3', '222', '444')",
            param: {
                table: 'user',
                columns: ['id', 'user', 'article'],
                values: [[1, 111, 123], [2, 223, 333], [3, 222, 444]]
            }
        }];

        _.each(params, function(value, key, list){
            should(func, value.param, value.expected);
        });
    });
});

//------------------------------------------------------------------------------
// LEFTJOIN
//------------------------------------------------------------------------------
describe('LEFTJOIN:', function() {
    describe('--sqlobj.leftJoin(leftJoin)', function() {
        var func = sqlobj.leftJoin;
        var params = [{
            expected: ' LEFT JOIN user AS u ON u.id = article.user_id',
            param: 'user AS u ON u.id = article.user_id'
        }, {
            expected: ' LEFT JOIN user AS u ON u.id = article.user_id',
            param: ['user AS u', 'u.id = article.user_id']
        }, {
            expected: ' LEFT JOIN user AS u ON u.id = article.user_id',
            param: {
                table: 'user',
                as: 'u',
                on: 'u.id = article.user_id'
            }
        }, {
            expected: ' LEFT JOIN user AS u ON u.id = article.user_id LEFT JOIN admin AS a ON a.id = article.admin_id',
            param: [
                ['user AS u', 'u.id = article.user_id'],
                ['admin AS a', 'a.id = article.admin_id']
            ]
        }, {
            expected: ' LEFT JOIN user AS u ON u.id = article.user_id LEFT JOIN admin AS a ON a.id = article.admin_id',
            param: [{
                table: 'user',
                as: 'u',
                on: 'u.id = article.user_id'
            }, {
                table: 'admin',
                as: 'a',
                on: 'a.id = article.admin_id'
            }]
        }];

        _.each(params, function(value, key, list){
            should(func, value.param, value.expected);
        });
    });
});

//------------------------------------------------------------------------------
// SET
//------------------------------------------------------------------------------
describe('SET:', function() {
    describe('--sqlobj.set(set)', function() {
        var func = sqlobj.set;
        var params = [{
            expected: " SET `id` = '1', `user` = 'wqm'",
            param: "`id` = '1', `user` = 'wqm'"
        }, {
            expected: " SET `id` = '1', `user` = 'wqm'",
            param: {
                'id': 1,
                'user': 'wqm'
            }
        }, {
            expected: " (`id`, `user`) VALUES ('1', 'wqm'), ('1', 'wqm')",
            param: [
                {
                    'id': 1,
                    'user': 'wqm'
                },
                {
                    'id': 1,
                    'user': 'wqm'
                }
            ]
        }];

        _.each(params, function(value, key, list){
            should(func, value.param, value.expected);
        });
    });
});

//------------------------------------------------------------------------------
// WHERE
//------------------------------------------------------------------------------
describe('WHERE:', function() {
    describe('sqlobj.where(where)', function() {
        var func = sqlobj.where;
        var params = [{
            expected: " `id` = 1 AND `name` = 'wqm'",
            param: "`id` = 1 AND `name` = 'wqm'"
        }, {
            expected: " `id` > '1' AND `user` <= 'wqm'",
            param: {
                "id >": 1,
                'user <=': 'wqm'
            }
        }];

        _.each(params, function(value, key, list){
            should(func, value.param, value.expected);
        });
    });
});

//------------------------------------------------------------------------------
// AND
//------------------------------------------------------------------------------
describe('AND:', function() {
    describe('sqlobj.where(where)', function() {
        var func = sqlobj.where;
        var params = [{
            expected: " `id` = '1' AND `user` = 'wqm'",
            param: {
                'id': 1,
                'user': 'wqm'
            }
        }, {
            expected: " (`id` = '1' OR `user` LIKE '%wqm%' AND `id` > '2' AND `id` < '2') OR (`myyy` IN ('a', 'b') AND `id` >= '2' AND `gg` != '2' AND `cc` <> '2' AND `user` = 'wqm') AND `abc`.`user` LIKE '%2%' OR (`id` = '2' AND `aaa` = '2' AND `bbb` = '33')",
            param: {
                '(id': '1',
                'or user like': 'wqm',
                'id >': 2,
                'id <': '2)',
                'or (myyy IN': ['a', 'b'],
                'id >=': 2,
                'gg !=': 2,
                'cc <>': 2,
                'user': 'wqm)',
                'abc.user like': 2,
                'or (id': 2,
                'aaa': 2,
                'bbb': '33)'
            }
        }];

        _.each(params, function(value, key, list){
            should(func, value.param, value.expected);
        });
    });
});

//------------------------------------------------------------------------------
// GROUP BY
//------------------------------------------------------------------------------
describe('GROUP BY:', function() {
    describe('sqlobj.groupby(groupby)', function() {
        var func = sqlobj.groupBy;
        var params = [{
            expected: ' id, user',
            param: 'id, user'
        }, {
            expected: ' id, user',
            param: ['id', 'user']
        }, {
            expected: ' article.id desc, user.name, user.id, comment.id, comment.user',
            param: {
                article: 'id desc',
                user: ['name', 'id'],
                comment: 'id, user'
            }
        }];

        _.each(params, function(value, key, list){
            should(func, value.param, value.expected);
        });
    });
});

//------------------------------------------------------------------------------
// ORDER BY
//------------------------------------------------------------------------------
describe('ORDER BY:', function() {
    describe('sqlobj.orderBy(orderBy)', function() {
        var func = sqlobj.orderBy;
        var params = [{
            expected: ' id DESC, user DESC',
            param: 'id DESC, user DESC'
        }, {
            expected: ' id DESC, user DESC',
            param: ['id DESC', 'user DESC']
        }, {
            expected: ' article.id desc, user.name, user.id, comment.id, comment.user',
            param: {
                article: 'id desc',
                user: ['name', 'id'],
                comment: 'id, user'
            }
        }];

        _.each(params, function(value, key, list){
            should(func, value.param, value.expected);
        });
    });
});

//------------------------------------------------------------------------------
// LIMIT
//------------------------------------------------------------------------------
describe('LIMIT:', function() {
    describe('sqlobj.limit(limit)', function() {
        var func = sqlobj.limit;
        var params = [{
            expected: ' 10',
            param: 10
        }, {
            expected: ' 1, 2',
            param: '1, 2'
        }, {
            expected: ' 0, 2',
            param: [0, 2]
        }, {
            expected: ' 1, 2',
            param: {
                offset: 1,
                rows: 2
            }
        }];

        _.each(params, function(value, key, list){
            should(func, value.param, value.expected);
        });
    });
});

//------------------------------------------------------------------------------
// sqlobj
//------------------------------------------------------------------------------
describe('sqlobj:', function() {
    describe('sqlobj(option)', function() {
        var func = sqlobj;
        var params = [{
            expected: "SELECT u.*, a.id AS article_id, a.link, c.id AS article_id, c.link FROM user AS u LEFT JOIN article AS a ON u.id = a.user_id WHERE `id` = '1' OR `u`.`id` > '100' OR `u`.`id` < '200' GROUP BY u.id, a.id ORDER BY u.id DESC, a.user_id LIMIT 5, 10",
            param: {
                select: {
                    u: '*',
                    a: ['id AS article_id', 'link'],
                    c: ['id AS article_id', 'link'],
                },
                from: 'user AS u',
                leftjoin: ['article AS a', 'u.id = a.user_id'],
                where: {
                    id: 1,
                    'or u.id >': 100,
                    'or u.id <': 200
                },
                groupby: ['u.id', 'a.id'],
                orderby: ['u.id DESC', 'a.user_id'],
                limit: [5, 10]
            }
        }, {
            expected: "INSERT INTO user SET `id` = '1', `user` = '111', `article` = '123'",
            param: {
                insert: 'user',
                set: {
                    'id': 1,
                    'user': '111',
                    'article': '123'
                }
            }
        }, {
            expected: "INSERT INTO user (`id`, `user`, `article`) VALUES ('1', '111', '123'), ('2', '223', '333'), ('3', '222', '444')",
            param: {
                insert: ['user', ['id', 'user', 'article'],
                    [1, 111, 123],
                    [2, 223, 333],
                    [3, 222, 444]
                ]
            }
        }, {
            expected: "INSERT INTO user (`id`, `user`, `article`) VALUES ('1', '111', '123'), ('2', '223', '333'), ('3', '222', '444')",
            param: {
                insert: {
                    table: 'user',
                    columns: ['id', 'user', 'article'],
                    values: [
                        [1, 111, 123],
                        [2, 223, 333],
                        [3, 222, 444]
                    ]
                }
            }
        }, {
            expected: "INSERT INTO user (`id`, `user`, `article`) VALUES ('1', '111', '123'), ('2', '223', '333'), ('3', '222', '444')",
            param: {
                insert: 'user',
                set: [{
                    'id': 1,
                    'user': '111',
                    'article': '123'
                }, {
                    'id': 2,
                    'user': '223',
                    'article': '333'
                }, {
                    'id': 3,
                    'user': '222',
                    'article': '444'
                }]
            }
        }, {
            expected: "UPDATE user SET `id` = '1', `user` = 'dddd', `article` = '123'",
            param: {
                UPDATE: 'user',
                SET: {
                    'id': 1,
                    'user': 'dddd',
                    'article': '123'
                }
            }
        }];

        _.each(params, function(value, key, list){
            should(func, value.param, value.expected);
        });
    });
});