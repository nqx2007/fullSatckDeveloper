import React, {userEffect, useEffect} from 'react';
import './App.css';

//引入测试组件
// import HooksTest from './components/HooksTest';
// import WithFormAntd from './components/FormAntd';
import WithKFormTest from './components/KFormTest';


// class HOCForm extends React.Component{
//   constructor(props){
//     super(props)
//   }
//   render(){
//     return (
//       <WithFormAntd wrappedComponentRef={formCC=>this.form=formCC}/>
//     )
//   }
//   componentDidMount(){
//     console.log(this.form)
//   }
// }
function App() {
  return (
    <div className="App">
          {/* <HooksTest /> */}
          {/* <HOCForm /> */}
          <WithKFormTest />
    </div>
  );
}

export default App;
