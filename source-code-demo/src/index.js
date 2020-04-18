// import React from 'react';
// import ReactDOM from 'react-dom';


//引入自己编写的react和react-dom----根据开课吧课程编写
import React from './myReact/kreact';
import ReactDOM from './myReact/kreact-dom';

import './index.css';
// import App from './App';

//函数组件
function FunTest(){
    return (
        <div>heihei</div>
    )
}
class ClassComp extends React.Component{
    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        return (
            <div>hhehe</div>
        )
    }
}
//类组件
ReactDOM.render(
    <div className="App">
        <h1 id="title">哈哈</h1>
        <p onClick={()=>{console.log("1111")}}>react</p>
        <FunTest />
        <ClassComp  />
    </div>, 
    document.getElementById('root')
);