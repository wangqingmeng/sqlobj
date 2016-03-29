# sqlobj
A JavaScript utility used to build SQL strings via an Object

## Install

```bash
$ npm install sqlobj
```

## Usage

```js
var sqlobj = require('sqlobj');
var options = {
    select: '*',
    from: 'user',
    where: {
        'id >': 10,
        'comment >=': 5
    },
    orderby: 'id DESC',
    limit: [10, 10]
};
var sql = sqlobj(options);

console.log(sql);
// SELECT * FROM user WHERE `id` > '10' AND `comment` >= '5' ORDER BY id DESC LIMIT 10, 10
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
