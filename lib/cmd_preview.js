var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var utils = require('./utils');

module.exports = function (dir) {
    dir = dir || '.';

    // express 初始化
    var app = express();
    var router = express.Router();

    app.use('/assets', serveStatic(path.resolve(dir, 'assets')));
    app.use(router);

    router.get('/posts/*', function (req, res, next) {
        var name = utils.stripExtname( req.params[0] );
        var file = path.resolve(dir, '_posts', name + '.md');
        var html = utils.renderPost(dir, file);

        res.end(html);
    });

    // 渲染列表
    router.get('/',function (req, res, next) {
        var html = utils.renderIndex(dir);
        res.end(html);
    });

    app.listen(3000, function () {
        console.log('serve start prot: 3000');
    });
}


// - - -
