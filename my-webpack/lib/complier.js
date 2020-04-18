//complier接收到传入的option

const fs=require("fs");//引入文件模块
const path=require("path")
// const parser=require("@babel/parser");//引入babel工具
// const traverse=require("@babel/traverse").default;
// const babel=require("@babel/core");

const parse=require("./parse.js")

module.exports=class Complier{
    constructor(options){
        console.log(options)
        const {entry,output}=options;
        this.entry=entry;
        this.output=output;
        this.moduleInfo=[];
    }
    /* 
        run是拿到参数，执行，分析入口文件
    */
    run(){
        const info=this.build(this.entry);
        this.moduleInfo.push(info);

        for(let i=0;i<this.moduleInfo.length;i++){
            const item=this.moduleInfo[i];
            const {dependcies}=item;
            if(dependcies && Object.keys(dependcies)!==0){
                for(let key in dependcies){
                    let itemInfo=this.build(dependcies[key]);
                    this.moduleInfo.push(itemInfo)
                }
            }
        }
       //格式转换，数组转对象
       const graph={};
       this.moduleInfo.forEach(item=>{
           graph[item.filename]={
               dependcies:item.dependcies,
               code:item.code
           }
       })
       console.log(graph)
       //生成构建代码文件
       this.file(obj)

    }
    //分析
    build(filename){
        //分析入口
        console.log("文件名称",filename)
        //根据filename拿到文件内容
        // const content=fs.readFileSync(filename,"utf-8");
        // console.log("文件内容",content)
        // //根据内容拿到依赖模块的内容，借助抽象语法树（@babel/parser)来分析，拿到入口模块内容
        // const ast=parser.parse(content,{
        //     sourceType:"module"
        // })
        // console.log("语法树",ast.program.body)
        //提取抽象语法树，借助@babel/traverse来分析语法树，拿到入口模块依赖路径
        // const dependcies={};//存放依赖
        // traverse(ast,{
        //     //获取引入的模块
        //     ImportDeclaration({node}){
        //         //node.source.value存放依赖的路径是相对于入口文件的路径，希望得到项目下的路径，需要做路径的拼接
        //         const dirname=path.dirname(filename);
        //         const newPath=path.join(dirname,node.source.value)
        //         dependcies[node.source.value]=("/"+newPath)
        //     }
            
        // })
        
        // console.log("文件依赖",dependcies)
        //处理入口模块代码，使用@babel/core,@babel/preset-env把ast语法树转换成合适的代码
        // const {code}=babel.transformFromAst(ast,null,{
        //     presets:["@babel/preset-env"]
        // })
        // console.log("转换的代码",code)
        const ast=parse.getAst(filename);
        const dependcies=parse.getDependcies(ast,filename);
        const code=parse.getCode(ast);

        //返回入口文件的分析结果
        return {
            filename,
            dependcies,
            code
        }
    }
    //文件生成
    file(code){
        //拿到文件的路径
        const {path:filePath,filename}=this.output;
        const finaPath=path.join(filePath,filename);
        const entry=this.entry;
        console.log(finaPath)
        //生成文件
        const bundle=`(function(graph){
            function require(module){
                //根据路径拿到对应的代码，eval
                function localRequire(relativePath){
                    //处理好的路径，在项目中的路径
                    return require(graph[module.dependcies[repativePath]])
                }
                var exports={};
                (function(require,exports,code){
                    eval(code)
                })(localRequire,exports,graph[module].code)
            }
            require('${entry}')
        })(${JSON.stringify(code)})`;
        fs.writeFileSync(finaPath,bundle,"utf-8");
    

    }
}