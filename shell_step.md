# 命令行创建步骤说明

### 定义静态博客命令格式

主要实现命令行功能:  

- 创建一个空博客 (myblog create)
- 文章使用MarkDown格式编写
- 本地事实预览 (myblog preview [dir])
- 生成整站静态 HTML (myblog build [dir] [--output target])


### 定义命令工具的基本架构
详情参照 `ready/command`

### 实时预览
`preview` 功能包含了 `create` 和 `build`  


### md2html 渲染文章页面

`markdown-it`模块
