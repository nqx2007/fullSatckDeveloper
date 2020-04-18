
//引入配置
const options=require("./webpack.config")
//引入编译器
const Complier=require("./lib/complier")
//创建
new Complier(options).run()


