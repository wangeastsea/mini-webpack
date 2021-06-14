const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const babel = require('babel-core')
/**
 *  创建当前文件的依赖对象
 */
let ID = 0
function createAsset(filename) {
    // 从入口文件读取依赖图
    const content = fs.readFileSync(filename, 'utf-8')
    // 全局的依赖文件
    const dependencies = [];
    // 转换成AST语法树
    const ast = babylon.parse(content, {sourceType: 'module'})
    traverse(ast, {
        ImportDeclaration: ({node}) => {
            dependencies.push(node.source.value)
        }
    })
    const id = ID++
    // 从ast编译成js代码
    const {code} = babel.transformFromAst(ast, null, {
        // 告诉babel以哪一种方式编译我们的代码
        presets: ['env']
    })
    return {
        // 当前文件的id
        id,
        // 当前文件的路径
        filename,
        // 当前文件的所有依赖
        dependencies,
        // 当前文件的转译后的code
        code
    }
}

// 创建依赖图谱
function createGraph(entry) {
    // 入口文件的依赖
    const mainAsset = createAsset(entry)
    // 依赖图谱
    const allAsset = [mainAsset]
    // 获取每一个文件的依赖对象
    for(let asset of allAsset) {
        // 获取当前文件的文件夹目录
        const dirname = path.dirname(asset.filename)
        // 做一个依赖文件和依赖id的映射
        asset.mapping = {}
        asset.dependencies.forEach(relativePath => {
            const absolutePath = path.join(dirname, relativePath)
            const childAsset = createAsset(absolutePath)
            asset.mapping[relativePath] = childAsset.id
            allAsset.push(childAsset)
        })
    }
    return allAsset
}
// 从依赖图谱生成bundle
function bundle(graph) {
    let modules = ''
    graph.forEach(module => {
        modules += `${module.id}:[
            function(require, module, exports) {
                ${module.code}
            },
            ${JSON.stringify(module.mapping)}
        ],`
    })
    // 这一块的思维，有点反人类，实现浏览器可以执行的commonjs
    const result = `
        (function(modules) {
            function require(id) {
                const [fn, mapping] = modules[id]
                function localRequire(relativePath) {
                    return require(mapping[relativePath])
                }
                const module = {exports: {}}
                fn(localRequire, module, module.exports)
                return module.exports
            }
            require(0)
        }
        )({${modules}})
    `
    return result
}


let graph = createGraph('./src/entry.js')
let result = bundle(graph)
console.log(result)