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

// 遍历所有文章
function eachSourceFile(sourceDir, cb) {
    rd.eachFileFilterSync(sourceDir, /\.md$/, cb);
}

// 渲染文章
function renderPost(dir, file) {
    var content = fs.readFileSync(file).toString();
    var post = parseSourceContent(content.toString());
    post.content = md2html(post.source);
    post.layout = post.layout || 'post';
    var html = renderFile(path.resolve(dir, '_layout', post.layout +'.html'), {post: post});
    return html;
}

// 渲染文章列表
function renderIndex(dir) {
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
    return html;
}

// 暴露函数
exports.renderPost = renderPost;
exports.renderIndex = renderIndex;
exports.eachSourceFile = eachSourceFile;
exports.stripExtname = stripExtname;





// - - -
