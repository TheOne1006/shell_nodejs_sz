## 常见命令格式

### 组成:

一般命令分为几部分:  
```bash
Usage : command [optons] [arguments]
```
- command 命令名称
- options: `--单词` 或 `--单字`, 比如 --help / -h
- arguments: 参数, 有时候选项也带参数

在查看命令帮助时,会出现 `[]`,`<>`,`|` 等符号,它们的含义如下:  

- `[ ]`: 可选
- `< >`: 可变选项, 一般是多选一,而且必选其一
- `x|y|z` : 多选一,如果加上 `[]`, 可不选
- `-abc` : 多选,如果加上 `[]`, 可不选


### 环境
在 Node.js 中, 可以通过 `process.argv` 来获取当前程序启动时的参数, __它是个数组__.  

shell demo
```bash
$ node test.js build xxx
```

1. process.argv的值
  - ['node', 'test.js', 'build', 'xxxx']
2. 第一个参数名为 Node.js 的命令名 即 `node`
3. 第二个为启动文件名, `test.js`
4. 第三起个为 执行 Node.js 的参数







- - - -
