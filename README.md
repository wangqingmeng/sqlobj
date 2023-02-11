# sqlobj
A JavaScript utility used to build SQL strings via an Object

## Install

```bash
$ npm install sqlobj
```

## Usage

SELECT
```js
var sqlobj = require('sqlobj');
var options = {
    select: '*',
    from: 'user',
    where: {
        'id >': 10,
        'comments >=': 5
    },
    orderby: 'id DESC',
    limit: [10, 10]
};
var sql = sqlobj(options);

console.log(sql);
// SELECT * FROM user WHERE `id` > '10' AND `comments` >= '5' ORDER BY id DESC LIMIT 10, 10
```
INSERT INTO
```js
var sqlobj = require('sqlobj');
var options = {
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
};
var sql = sqlobj(options);

console.log(sql);
// INSERT INTO user (`id`, `user`, `article`) VALUES ('1', '111', '123'), ('2', '223', '333'), ('3', '222', '444')
```
UPDATE
```js
var options = {
    UPDATE: 'user',
    SET: {
        'user': 'dddd',
        'article': '123'
    },
    where: {
        'id': 1
    }
};
var sql = sqlobj(options);

console.log(sql);
// UPDATE user SET `user` = 'dddd', `article` = '123' WHERE `id` = '1'
```

## License

(The MIT License)

Copyright (c) 2015-2016 wangqingmeng <wqmabc123@163.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
