// const Koa=require("koa");
// const app=new Koa();


const MyKoa=require("./myKoa/myKoaIndex");
const app=new MyKoa();

app.use(async (ctx,next)=>{
    ctx.body='1';
    await next();
    ctx.body+='5';
})
app.use(async (ctx,next)=>{
    ctx.body+='2';
    await next();
    ctx.body+='4';
})
app.use(async (ctx,next)=>{
    ctx.body+='3';
    await next();
})


app.listen(3000)