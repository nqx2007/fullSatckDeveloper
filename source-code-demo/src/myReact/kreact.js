
export class Component{
    //通过该方式生成的组件需要定义一个是class的标记为
    static isClassComponent=true;
    constructor(props){
        this.props=props;
        this.state={}
    }
}
//createElement创建虚拟dom
function createElement(type,props,...children){
    // console.log(arguments)//先打印出参数，看看参数的结构
    const {__source,__self,...restProps}=props;//结构粗不要的属性
    //根据类型判断组件类型
    //1:原生标签；2:函数组件；3:类组件
    let vtype=null;
    if(typeof type==="string"){
        vtype=1;
    }else{
        if(typeof type==="function" && type.isClassComponent){
            vtype=3;
        }else{
            vtype=2;
        }
    }
    return {
        type,
        props:{
            ...restProps,
            children
        },
        vtype
    }


}

export default {createElement,Component}