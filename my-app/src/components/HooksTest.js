import React ,{useState,useContext} from 'react';


//简单使用hooks
// function HooksTest(){
//     const [name,setName]=useState('niuqingxia')
//     return (
//         <div onClick={()=>setName("lihongcheng")}> 
//             hello! {name}
//         </div>
//     )
// }

//数组

// function FruitAdd(props){
//     const [fruit,setFruit]=useState("");
//     const {fruitAdd}=props
//     return (
//         <input type="text" value={fruit || ""} onChange={e=>setFruit(e.target.value)} onKeyDown={(e)=>{
//             if(e.key==="Enter"){
//                 fruitAdd(e.target.value);
//                 setFruit("")
//             }

//         }} />
//     )
// }
// function HooksTest(){
//     const [fruits,setFruits]=useState(['苹果','梨子','西瓜'])
//     console.log(fruits)
//     return(
//         <div>
//             <FruitAdd fruit橘子Add={fruitname=>setFruits([...fruits,fruitname])}/>
//             <p>当前的水果有:</p>
//             <ul>
//                 {
//                     fruits.map((fruit,index)=>{
//                        return  <li key={index}>{fruit}</li>
//                     })
//                 }
//             </ul>
//         </div>
//     )
// }
 
//useContext
const Context=React.createContext({counter:0});
const {Provider}=Context;
function HooksTest(){
    return (
        <Provider value={{counter:12}}>
            <ChildComp />
        </Provider>
    )
}
export default HooksTest;
function ChildComp(){
    const context=useContext(Context);
    console.log(context)
    return (
        <div>haha</div>
    )
}