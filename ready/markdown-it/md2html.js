var MarkdownIt = require('markdown-it');
var md = new MarkdownIt({
    html : true,
    langPrefix : 'code-'
});

var h1str = md.render('# h1');

var hrstr = md.render('---');

console.log(h1str);
console.log(hrstr);
