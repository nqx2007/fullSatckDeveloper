
//定义虚拟节点类型的常量

const vnodeType={
    HTML:'HTML',
    TEXT:'TEXT',
    COMPONENT:'COMPONENT',
    CLASS_COMPONENT:'CLASS_COMPONENT'
}
//定义虚拟节点子元素的类型常量
const childType={
    EMPTY:'EMPTY',
    SINGLE:'SINGLE',
    MULTIPLE:'MULTIPLE'
}

/**
 * 创建虚拟节点
 * @param {标签名} tag 
 * @param {属性} propsData 
 * @param {子元素} children 
 */
function createElement(tag,propsData,children){
    let vnodeFlag=null;
    let childrenType=null;

  //获取虚拟节点的类型，根据标签类型判断  
  if(!tag){
      vnodeFlag=vnodeType.TEXT
  }else if(typeof tag==="string"){
    vnodeFlag=vnodeType.HTML
  }else if(typeof tag==="function"){//此种情况包含了函数组件和类组件
    vnodeFlag=vnodeType.COMPONENT
  }
  //获取子元素的类型
  if(children==null){
      childrenTYpe=childType.EMPTY
  }else if(Array.isArray(children)){
      if(children.length===0){
          childrenType=childType.EMPTY
      }else{
          childrenType=childType.MULTIPLE
      }
  }else{//文本节点
      childrenType=childType.SINGLE;
      children=createTextVnode(children+"")
  }
  return {
    vnodeFlag,
    tag,
    propsData,
    children,
    childrenType,
    el:null
  }
}
/*创建文本节点的虚拟节点
*
*/
function createTextVnode(text){
    return {
        vnodeFlag:vnodeType.TEXT,
        tag:null,
        propsData:null,
        children:text,
        childrenType:childType.SINGL,
        el:null
    }
}

/**
 * 将虚拟节点转换成真实dom并挂载
 * @param {虚拟节点} vnode 
 * @param {挂载容器} cotainer 
 */
function render(vnode,container){
    //需要区别是首次挂载还是再次渲染更新
    if(container.vnode){//再次渲染
        patchElement(container.vnode,vnode,container)
    }else{//首次挂载
        mountFn(vnode,container)
    }
    //每次渲染都将vnode设置为container的属性，方便区分首次挂载还是再次渲染，同时为之后的diff算法做准备
    container.vnode=vnode
}
/**
 * 挂载函数
 * @param {*} vnode 
 * @param {*} container 
 */
function mountFn(vnode,container,refNode){
    let {vnodeFlag,tag,children,childrenType}=vnode;
    if(vnodeFlag===vnodeType.TEXT){//文本节点
        createText(vnode,container)
    }else if(vnodeFlag===vnodeType.HTML){//元素节点
        createHtmlElement(vnode,container,refNode)
    }
}
/**
 * diff算法的实现
 * @param {*} preVnode 
 * @param {*} nextVnode 
 * @param {*} container 
 */
function patchElement(preVnode,nextVnode,container){
    if(preVnode.vnodeFlag!==nextVnode.vnodeFlag){//虚拟节点的类型不一样，直接替换
        container.removeChild(preVnode.el);
        mountFn(nextVnode,container)
    }else if(nextVnode.vnodeFlag===vnodeType.TEXT){//文本类型
        let el=(preVnode.el=nextVnode.el);
        if(preVnode.children!==nextVnode.children){
            el.nodeValue=nextVnode.children
        }
    }else if(nextVnode.vnodeFlag===vnodeType.HTML){//标签类型
        patchHtmlElement(preVnode,nextVnode,container)
    }
}





/**
 * 创建文本节点
 * @param {虚拟节点} vnode 
 * @param {挂载容器} container 
 */
function createText(vnode,container){
    let {children}=vnode;
    let dom=document.createTextNode(children);
    container.appendChild(dom)
}

/**
 * 创建标签元素
 * @param {*} vnode 
 * @param {*} container 
 */
function createHtmlElement(vnode,container,refNode){
    let {tag,propsData,childrenType,children}=vnode;
    let dom=document.createElement(tag);//根据标签创建HTML元素
    vnode.el=dom
    //设置属性
    for(let propname in propsData){
        patchProps(dom,propname,null,propsData[propname])
    }
    //循环挂载children
    if(childrenType!==childType.EMPTY){
        if(childrenType===childType.SINGLE){
            mountFn(children,dom)
        }else{
            children.forEach(child=>{
                mountFn(child,dom)
            })
        }
    }
  
    //
    refNode?container.insertBefore(dom,refNode):container.appendChild(dom)
}

/**
 * 
 * @param {元素} el 
 * @param {属性名} propname 
 * @param {原来的属性值} preVal 
 * @param {新的属性值} nextVal 
 */
function patchProps(el,propname,preVal,nextVal){
    //有时候需要对属性名做特殊处理
    switch(propname){
        case 'style':
            if(nextVal){
                for(let key in nextVal){
                    el.style[key]=nextVal[key]
                };
            }
            if(preVal){
                for(let key in preVal){
                    if(!nextVal.hasOwnProperty(key)){
                        el.style[key]=null
                    }
                }
            }
            break;
        case 'class':
            el.className=nextVal;
            break;
        default:
            if(propname.slice(0,2)==="on"){
                if(preVal){
                    el.removeEventListener(propname.slice(2),preVal)
                }
                if(nextVal){
                    el.addEventListener(propname.slice(2),nextVal)
                }
            }else{
                el.setAttribute(propname,nextVal)
            }
            break;
    }
}


/**
 * 
 * @param {*} preVnode 
 * @param {*} nextVnode 
 * @param {*} container 
 */
function patchHtmlElement(preVnode,nextVnode,container){
    let el=(preVnode.el=nextVnode.el)
    if(preVnode.tag!==nextVnode.tag){//HTML标签的类型不一样
        container.removeChild(el);
        mountFn(nextVnode,container);
        return;
    }
    /*更新属性*/
    let {propsData:prePropsData}=preVnode;
    let {propsData:nextPropsData}=nextVnode;
    for(let propname in nextPropsData){
        patchProps(el,propname,prePropsData[propname],nextPropsData[propname])
    }
    for(let propname in prePropsData){
        if(prePropsData[propname] && !nextPropsData.hasOwnProperty(propname)){
            patchProps(el,propname,prePropsData[propname],null) 
        }
    }
    /*更新属性*/
    /*更新子元素*/
    patchChildren(preVnode.childrenType,preVnode.children,nextVnode.childrenType,nextVnode.children,container)
    /*更新子元素*/
}

function patchChildren(preChildrenType,preChildren,nextChildrenType,nextChildren,container){
    switch(preChildrenType){
        case childType.EMPYT:
            switch(nextChildrenType){
                case childType.EMPTY://之前是空，现在也是空
                    break;
                case childType.SINGLE://之前是空，现在是文本，新增文本
                    mountFn(nextChildren,container)
                    break;
                case childType.MULTIPLE://之前是文本，现在是元素
                    nextChildren.forEach(child=>{
                        mountFn(child,container)
                    })
                    break;
            }
            break;
        case childType.SINGLE:
            switch(nextChildrenType){
                case childType.EMPTY://之前是文本，现在是空的
                    container.removeChild(preChildren.el)
                    break;
                case childType.SINGLE://之前是文本，现在是文本呢吧
                    patchElement(preChildren,nextChildren,container)
                    break;
                case childType.MULTIPLE://之前是文本，现在是标签
                    container.removeChild(preChildren.el)
                    nextChildren.forEach(child=>{
                        mountFn(child,container)
                    })
                    break;
            }
            break;
         case childType.MULTIPLE:
            switch(nextChildrenType){
                case childType.EMPTY://
                    preChildren.forEach(child=>{
                        container.removeChild(child.el)
                    })
                    break;
                case childType.SINGLE:
                    preChildren.forEach(child=>{
                        container.removeChild(child.el)
                    })
                    mountFn(nextChildren,container)
                    break;
                case childType.MULTIPLE://旧的节点有多个子节点，新的节点也有多的子节点
                    let lastIndex=0;
                    let find=false;
                    for(let i=0;i<nextChildren.length;i++){
                        let nextChild=nextChildren[i];
                        let j;
                        for(j;j<preChildren.lenght;j++){ß
                            let preChild=preChildren[j];
                            if(nextChild.key===preChild.key){
                                find=true;
                                if(j<lastIndex){//需要移动
                                    let refNode=nextChildren[i-1].el.nexSibling;
                                    containner.insertBefore(preChild.el,refNode)
                                }
                            }else{
                                lastIndex=j;
                            }
                        }
                        if(!find){//没找到，是新增
                            let refNode=i-1<0?nextChildren[0].el.nexSibling:nextChildren[i-1].el.nexSibling
                            mountFn(nextChild,container,refNode)
                        }
                    }
                    for(let i=0;i<preChildren.length;i++){
                        let preChild=preChildren[i];
                        const has=nextChildren.find(nextChild.key===preChild.key)
                        if(!has){
                            container.removeChild(preChild.el)
                        }
                    }
                    break;
            }
            break;
    }
}