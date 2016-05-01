var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');

module.exports = function (dir) {
    dir = dir || '.';

    // express 初始化
    var app = express();
    var router = express.Router();

    app.use('/assets', serveStatic(path.resolve(dir, 'assests')));
    app.use(router);

    router.get('/posts/*', function (req, res, next) {
        res.end(req.params[0]);
    });

    // 渲染列表
    router.get('/',function (req, res, next) {
        res.end('articles list');
    });

    app.listen(3000);
}
