
const fs=require("fs");//引入文件模块
const path=require("path")
const parser=require("@babel/parser");//引入babel工具
const traverse=require("@babel/traverse").default;
const babel=require("@babel/core");

module.exports={
    //得到抽象语法树
    getAst(filename){
        //根据filename拿到文件内容
        const content=fs.readFileSync(filename,"utf-8");
        console.log("文件内容",content)
        //根据内容拿到依赖模块的内容，借助抽象语法树（@babel/parser)来分析，拿到入口模块内容
        const ast=parser.parse(content,{
            sourceType:"module"
        })
        console.log("语法树",ast.program.body);
        return ast;//返回抽象语法树
    },
    //得到依赖
    getDependcies(ast,filename){
        const dependcies={};//存放依赖
        traverse(ast,{
            //获取引入的模块
            ImportDeclaration({node}){
                //node.source.value存放依赖的路径是相对于入口文件的路径，希望得到项目下的路径，需要做路径的拼接
                const dirname=path.dirname(filename);
                const newPath=path.join(dirname,node.source.value)
                dependcies[node.source.value]=("./"+newPath)
            }
            
        })
        
        console.log("文件依赖",dependcies);
        return dependcies
    },
    //得到代码
    getCode(ast){
         //处理入口模块代码，使用@babel/core,@babel/preset-env把ast语法树转换成合适的代码
         const {code}=babel.transformFromAst(ast,null,{
            presets:["@babel/preset-env"]
        })
        console.log("转换的代码",code)
        return code
    }
}