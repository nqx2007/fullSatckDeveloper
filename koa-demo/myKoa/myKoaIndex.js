
const http=require("http");
const context=require("./context");
const request=require("./request");
const response=require("./response");


class MyKoa {
    constructor(){
        this.middlewares=[];
    }
    /**
     * 
     * @param {监听的端口} port 
     */
    listen(...args){
        let app=http.createServer(async (req,res)=>{
            let ctx=this.createContext(req,res);
            //合并中间件，得到最终执行的函数
            let finalFn=this.compose(this.middlewares)
            //执行合并之后的中间件
            await finalFn(ctx);
            res.end(ctx.body)
        });
    
        app.listen(...args)
    }
    /**
     * 
     * @param {中间件} middleware 
     */
    use(middleware){
        this.middlewares.push(middleware)
    }
    /**
     * 创建上下文
     * @param {原生} req 
     * @param {原生} res 
     */
    createContext(req,res){
        const ctx=Object.create(context);
        ctx.request=Object.create(request);
        ctx.response=Object.create(response);

        ctx.req=ctx.request.req=req;
        ctx.res=ctx.response.res=res;

        return ctx;
    }
    /**
     * 合并中间件
     * @param {中间件列表} middlewares 
     */
    compose(middlewares){
        return function(ctx){
            return dispatchMiddleware(0);
            function dispatchMiddleware(i){
                let fn=middlewares[i];
                if(!fn){
                    return Promise.resolve();
                }else{
                    return Promise.resolve(fn(ctx,function next(){
                        return dispatchMiddleware(i+1)
                    }))
                }
            }
        }
    }
}

module.exports=MyKoa;