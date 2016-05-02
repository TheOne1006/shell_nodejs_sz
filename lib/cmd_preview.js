var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var fs = require('fs');
var swig = require('swig');
var MarkdownIt = require('markdown-it');
var rd = require('rd');
var md = new MarkdownIt({
    html: true,
    langPrefix: 'code-'
});
swig.setDefaults({cache: false});

module.exports = function (dir) {
    dir = dir || '.';

    // express 初始化
    var app = express();
    var router = express.Router();

    app.use('/assets', serveStatic(path.resolve(dir, 'assets')));
    app.use(router);

    router.get('/posts/*', function (req, res, next) {
        var name = stripExtname( req.params[0] );
        var file = path.resolve(dir, '_posts', name + '.md');
        // console.log(file);

        fs.readFile(file, function (err, content) {
            if(err) {
                return next(err);
            }
            var post = parseSourceContent(content.toString());
            // console.log(post);
            post.content = md2html(post.source);
            post.layout = post.layout || 'post';
            var html = renderFile(path.resolve(dir, '_layout', post.layout +'.html'), {post: post});
            res.end(html);

        });


    });

    // 渲染列表
    router.get('/',function (req, res, next) {
        // res.end('articles list');
        var list = [];
        var sourceDir = path.resolve(dir, '_posts');

        rd.eachFileFilterSync(sourceDir, /\.md$/, function (file, s) {
            var source = fs.readFileSync(file).toString();
            var post = parseSourceContent(source);
            post.timestamp = new Date(post.data);
            post.url = '/posts/' + stripExtname(file.slice( sourceDir.length + 1)) + '.html';
            list.push(post);
        });

        list.sort(function (a, b) {
            return b.timestamp - a.timestamp;
        });

        // console.log(list);

        var html = renderFile(path.resolve(dir, '_layout', 'index.html'), {posts:list});
        res.end(html);
    });

    app.listen(3000, function () {
        console.log('serve start prot: 3000');
    });
}


/**
 * 工具方法
 * 去掉文件名中的扩展名
 * test.md ==> test
 */
function stripExtname( name ) {
    var i = 0 - path.extname(name).length;
    if(i === 0) {
        i = name.length;
    }
    return name.slice(0, i);
}

// 将md 转换成 html
function md2html(content) {
    return md.render(content || '');
}

// 解析文章内容
function parseSourceContent(data) {
    var split = '---\n';
    // 第一个开始的起始位置
    var i = data.indexOf(split);
    var info = {};

    if(i !== -1) {
        // 开始找第二个 标记
        var j = data.indexOf(split, i + split.length);
        if(j !== -1) {
            // 其他内容
            var titleContent = data.slice(i + split.length, j).trim();
            data = data.slice(j + split.length);

            /**
             * 换行分割, 获取
             * title: xxx
             * date: xxx
             */
            titleContent.split('\n').forEach(function (line) {
                console.log(line);
                var i = line.indexOf(':');
                if( i !== -1) {
                    var name = line.slice(0, i).trim();
                    var value = line.slice(i+1).trim();
                    info[name] = value;
                }
            });
        }
    }
    info.source = data;

    // console.log(info);

    return info;
}

// 渲染模板
function renderFile(file, data) {
    return swig.render(fs.readFileSync(file).toString(), {
        filename: file,
        autoescape: false,
        locals: data
    });
}


// - - -
