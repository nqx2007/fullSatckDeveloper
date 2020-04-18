async function fn1(next){
     console.log("fn1 start");
     await next();
     console.log("fn1 end")
};

async function fn2(next){
    console.log("fn2 start");
    await delayFn();
    await next()
    console.log("fn2 end")
}

 function fn3(){
    console.log("fn3")
}


function delayFn(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },3000)
    })
}
function composeFn(middlewares){
    return function(){
        return dispatchMiddle(0);
        function dispatchMiddle(i){
            let fn=middlewares[i];
            if(!fn){
                return Promise.resolve()
            }else{
                return Promise.resolve(fn(function next(){
                    return dispatchMiddle(i+1)
                }))
            }
        }  
    }
   
}







const middlewares=[fn1,fn2,fn3];
let finalFn=composeFn(middlewares);
finalFn()