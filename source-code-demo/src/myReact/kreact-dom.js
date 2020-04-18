

/*react-dom的渲染方法render
*@param:vnode----虚拟dom,从createElement的返回值获得
*@param:container---容器
*
*/

function render(vnode,container){
    console.log(vnode)
    //将虚拟dom转换成真实的dom
    mount(vnode,container);
}
//挂载函数,根据vtype来做不同的处理
function mount(vnode,container){
    let {vtype}=vnode
    if(!vtype){//文本节点
        mountText(vnode,container)
    }
    if(vtype===1){//原生标签
       mountHtml(vnode,container) 
    }
    if(vtype===2){//函数组件
        mountFun(vnode,container)
    }
    if(vtype===3){//类组件
        mountClass(vnode,container)
    }
} 
//文本节点的挂载
function mountText(vnode,container){
    const node=document.createTextNode(vnode);
    container.appendChild(node);
}
//原生标签的挂载
function mountHtml(vnode,container) {
    let {type,props}=vnode;
    //在原生标签的处理中，type指的就是标签名
    const node=document.createElement(type);
    //给节点设置属性
    Object.keys(props)
    .filter(key=>key!=="children")
    .forEach(name=>{
        if(name==="className"){
            //处理特殊的标签className
            node.setAttribute("class",props[name])
        }else if(name.slice(0,2)==="on"){
             //处理事件绑定
            let eventname=name.slice(2).toLowerCase();
            node.addEventListener(eventname,props[name])
        }else{
             //其余的属性
             node.setAttribute(name,props[name]);
        }
        
    })
    //子节点的挂载
    props.children.map(item=>{
        if(Array.isArray(item)){
            item.forEach(vo=>mount(vo,node))
        }else{
            mount(item,node)
        }
        
    })
    //真实的dom节点挂载页面
    container.appendChild(node);
}
//函数组件的挂载
function mountFun(vnode,container){
    let {type,props}=vnode;
    const node=type(props);//执行函数，获取组件
    mount(node,container)
}
//类组件的挂载
function mountClass(vnode,container){
    let {type,props}=vnode;
    const renderClass=new type(props);//创建实例
    const node=renderClass.render();//执行render方法，获取vnode
    mount(node,container)
}
export default {render}