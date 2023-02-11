/*!
 * Copyright(c) 2015-2016 wangqingmeng
 * A JavaScript utility used to build SQL strings via an Object
 * @module sqlobj
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var _ = require('underscore');

/**
 * Module variables.
 * @private
 */

var toString        = Object.prototype.toString;
var hasOwnProperty  = Object.prototype.hasOwnProperty;
_.dataType = function (data) {
    return toString.call(data).replace(/(\[object\s)|(\])/g, '');
};

/**
 * Module exports.
 * @public
 */

module.exports = sqlobj;

/**
 * A JavaScript utility used to build SQL strings via an Object
 *
 * @param {Object} options
 * @public
 */

function sqlobj (options) {
    if (_.dataType(options) !== 'Object') {
        return false;
    };
    _.each(options, function(value, key, list){

        options[key.toLowerCase()] = value;

    });

    var res = '';

    if (hasOwnProperty.call(options, 'select')) {
        res += 'SELECT' + sqlobj.select(options.select);
    };
    if (hasOwnProperty.call(options, 'update')) {
        res += 'UPDATE ' + options.update;
    };
    if (hasOwnProperty.call(options, 'insert')) {
        res += 'INSERT INTO' + sqlobj.insert(options.insert);
    };
    if (hasOwnProperty.call(options, 'from')) {
        res += ' FROM ' + options.from;
    };
    if (hasOwnProperty.call(options, 'leftjoin')) {
        res += sqlobj.leftJoin(options.leftjoin);
    };
    if (hasOwnProperty.call(options, 'set')) {
        res += sqlobj.set(options.set);
    };
    if (hasOwnProperty.call(options, 'where')) {
        if (!_.isEmpty(options.where)){
            res += ' WHERE' + sqlobj.where(options.where);
        }
    };
    if (hasOwnProperty.call(options, 'groupby')) {
        if (!_.isEmpty(options.groupby)){
            res += ' GROUP BY' + sqlobj.groupBy(options.groupby);
        }
    };
    if (hasOwnProperty.call(options, 'orderby')) {
        if (!_.isEmpty(options.orderby)){
            res += ' ORDER BY' + sqlobj.orderBy(options.orderby);
        }
    };
    if (hasOwnProperty.call(options, 'limit')) {
        res += ' LIMIT' + sqlobj.limit(options.limit);
    };

    return res;
};

/**
 * handel the SELECT part
 *
 * @param  {All} select
 * @return {String}
 * @public
 */

sqlobj.select = function (select, tableName) {
    var tableName = tableName ? (tableName + '.') : '';
    var res = '';

    switch (_.dataType(select)) {
        case 'String':
            res += ' ' + tableName + (select.replace(/\,(\s+)?/g, ', ' + tableName) || '*');
            break;
        case 'Array':
            res += ' ' + (_.map(select, mapIteratee).join(', ') || (tableName + '*'));
            break;
        case 'Object':
            _.isEmpty(select)
                ? (res += ' ' + tableName + '*,')
                : _.each(select, eachIteratee);
            res = res.substr(0, res.length - 1);
            break;
        default:
            res += ' ' + tableName + '*';
    };

    return res;

    function mapIteratee (v, k, l) {
        return tableName + v;
    };
    function eachIteratee (v, k, l) {
        res += sqlobj.select(v, k) + ',';
    };
};

/**
 * handel the INSERT part
 *
 * @param  {All} insert
 * @return {String}
 * @public
 */

sqlobj.insert = function (insert) {
    var res = '';

    switch (_.dataType(insert)) {
        case 'String':
            res += ' ' + insert;
            break;
        case 'Array':
            var table = insert.shift();
            var columns = insert.shift();
            res += ' ' +  table;
            res += ' (`' + columns.join('`, `') + '`)';
            res += ' VALUES';
            _.each(insert, eachIteratee);
            break;
        case 'Object':
            res += ' ' +  insert.table;
            res += ' (`' + insert.columns.join('`, `') + '`)';
            res += ' VALUES';
            _.each(insert.values, eachIteratee);
            break;
        default:
            res += ' ';
    };

    return res.replace(/\,(\s+)?$/, '');

    function eachIteratee (v, k, l) {
        res += " ('" + v.join("', '") + "'),";
    };
};

/**
 * handel the LEFTJOIN part
 *
 * @param  {String|Array|Object} leftJoin
 * @return {String}
 * @public
 */

sqlobj.leftJoin = function (leftJoin) {
    var res = '';

    switch (_.dataType(leftJoin)) {
        case 'String':
            res += ' ' + (leftJoin && ('LEFT JOIN ' + leftJoin));
            break;
        case 'Array':
            _.isObject(leftJoin[0])
                ? _.each(leftJoin, eachIteratee)
                : (res += ' LEFT JOIN ' + leftJoin.join(' ON '));
            break;
        case 'Object':
            _.each(leftJoin, function(value, key, list){
                leftJoin[key.toLowerCase()] = value;
            });
            var table = (leftJoin.table || '');
            var as    = (leftJoin.as || '') && ('AS ' + leftJoin.as);
            var on    = (leftJoin.on || '') && ('ON ' + leftJoin.on);
            res += ' LEFT JOIN ' + table + ' ' + as + ' ' + on;
            break;
        default:
            res += ' ';
    };

    return res;

    function eachIteratee (v, k, l) {
        res += sqlobj.leftJoin(v);
    };
};

/**
 * handel the SET part
 *
 * @param  {String|Array|Object} set
 * @return {String}
 * @public
 */

sqlobj.set = function (set) {
    var SET = ' SET'
    var res = '';

    switch (_.dataType(set)) {
        case 'String':
            res += ' ' + set;
            break;
        case 'Array':
            SET = '';
            var columns = _.keys(set[0]);
            res += ' (`' + columns.join('`, `') + '`) VALUES';
            _.each(set, joinIteratee);
            break;
        case 'Object':
            _.each(set, eachIteratee);
            break;
        default:
            res += ' ';
    };

    res = SET + res.replace(/\,(\s+)?$/, '');

    return res;

    function joinIteratee (v, k, l) {
        res += " ('" + _.values(v).join("', '") + "'),";
    };

    function eachIteratee (v, k, l) {
        res += ' `' + k + "` = '" + v + "',";
    };
};

/**
 * handel the WHERE part
 *
 * @param  {String|Object} where
 * @return {String}
 * @public
 */

sqlobj.where = function (where) {
    var res = '';

    switch (_.dataType(where)) {
        case 'String':
            res += ' ' + (where || '1 > 2');
            break;
        case 'Object':
            res += sqlobj.and(where);
            break;
        default:
            res += ' 1 > 2';
    };

    return res;
};

/**
 * handel the AND part
 *
 * @param  {Object} obj
 * @return {String}
 * @public
 */

sqlobj.and = function (obj) {
    if (_.dataType(obj) !== 'Object') {
        return '';
    };

    var keyHandlers = {
        'or': function (key) {
            return key.replace(/^(\s+)?AND(\s+)?\`or(\s+)?/gi, ' OR `');
        },
        '.': function (key) {
            return key.replace(/\./g, '`.`');
        },
        '(': function (key) {
            return key.replace(/(\`)?\(/g, '(`');
        },
        '>=': function (key) {
            return key.replace(/(\s+)?\>\=(\s+)?\`/gi, '` >=');
        },
        '<=': function (key) {
            return key.replace(/(\s+)?\<\=(\s+)?\`/gi, '` <=');
        },
        '<>': function (key) {
            return key.replace(/(\s+)?\<\>(\s+)?\`/gi, '` <>');
        },
        '!=': function (key) {
            return key.replace(/(\s+)?\!\=(\s+)?\`/gi, '` !=');
        },
        '>': function (key) {
            return key.replace(/(\s+)?\>(\s+)?\`/gi, '` >');
        },
        '<': function (key) {
            return key.replace(/(\s+)?\<(\s+)?\`/gi, '` <');
        },
        'like': function (key) {
            return key.replace(/(\s+)?like(\s+)?\`/gi, '` LIKE');
        },
        'in': function (key) {
            return key.replace(/(\s+)?in(\s+)?\`/gi, '` IN');
        }
    };

    var res = '';
    _.each(obj, function(value, key, list){
        var kMatch = key.match(/or|\.|\(|\>\=|\<\=|\<\>|\!\=|\>|\<|like|in/gi);
        var newKey = ' AND `' + key + '`';
        _.each(kMatch, function(v, k, l){
            newKey = keyHandlers[v.toLowerCase()](newKey);
        });

        var equal = key.match(/\>\=|\<\=|\<\>|\!\=|\>|\<|like|in/gi) ? ' ' : ' = ';

        var newVal = value;
        if (key.match(/like/gi)) {
            newVal = "%" + newVal + "%";
        };
        if (_.dataType(newVal) !== 'Array') {
            newVal = "'" + newVal + "'";
        } else {
            newVal = "('" + newVal.join("', '") + "')";
        };
        newVal = newVal.replace(/\)\'/, "')");

        res += newKey +equal + newVal;
    });

    return res.replace(/^(\s+)?AND/, '');
};

/**
 * handel the GROUT BY | ORDER BY part
 *
 * @param  {String|Array|Object} orderBy
 * @return {String}
 * @public
 */

sqlobj.groupBy = sqlobj.orderBy = function (by, tableName) {
    var tableName = tableName ? (tableName + '.') : '';
    var res = '';

    switch (_.dataType(by)) {
        case 'String':
            res += ' ' + tableName + by.replace(/\,(\s+)?/g, ', ' + tableName);
            break;
        case 'Array':
            res += ' ' + tableName + by.join(', ' + tableName);
            break;
        case 'Object':
            _.each(by, eachIteratee);
            break;
        default:
            res += ' ';
    };

    res = res.replace(/\,(\s+)?$/, '');

    return res;

    function eachIteratee (v, k, l) {
        res += sqlobj.orderBy(v, k) + ',';
    };
};

/**
 * handel the LIMIT part
 *
 * @param  {Number|String|Array|Object} limit
 * @return {String}
 * @public
 */

sqlobj.limit = function (limit) {
    var res = '';

    switch (_.dataType(limit)) {
        case 'Number':
            res += ' ' + limit;
            break;
        case 'String':
            res += ' ' + limit;
            break;
        case 'Array':
            res += ' ' + limit.join(', ');
            break;
        case 'Object':
            res += ' ' + (limit.offset || 0);
            res += ['', ', ' + limit.rows][Number(!!limit.rows)];
            break;
        default:
            res += ' ';
    };

    return res;
};
