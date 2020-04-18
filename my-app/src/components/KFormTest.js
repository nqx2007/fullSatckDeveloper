
import React from 'react';

class KFormTest extends React.Component {
    constructor(props) {
        super(props);
    }
    handleSubmit=()=>{
        
    }
    render() { 
        console.log(this.props)
        const {getFieldDecorator}=this.props;
        return ( 
            <div>
                {
                    getFieldDecorator("username",{
                        required:true,message:'please enter username'
                    })(<input type="test" />)
                }
                {
                     getFieldDecorator("password",{
                        required:true,message:'please enter password'
                    })( <input type="password" />)
                }
                <button onClick={this.handleSubmit}>登录</button>
            </div>
         );
    }
}
 
const WithKFormTest=KFormCreate(KFormTest);
export default WithKFormTest;
//包装表单的高级函数
function KFormCreate(Comp){
    return class extends React.Component{
        constructor(props){
            super(props)
            this.options={};
            this.state={};

        }
        handleChange=(e)=>{
           let {name,value}=e.target;
           this.setState({
               [name]:value
           },()=>{
               this.validField(name)
           })
        }
        validField=(field)=>{
            //根据field获取校验规则
            const rules=this.options[field]
            //根据规则进行逻辑校验
        }
        getFieldDec=(field,options)=>{
            console.log(options)
            this.options[field]=options;
            return InputComp=> {
                return (
                    <div>
                        {React.cloneElement(InputComp,{
                            name:field,
                            value:this.state[field] || "",
                           onChange:(e)=>this.handleChange(e)
                        })}
                    </div>
                )
            }

        }
        validate=()=>{
            
        }
        render(){
            return (
               <div>
                   <Comp {...this.props} getFieldDecorator={this.getFieldDec} validFields={this.validate}/>
               </div>
                
            )
        }
    }
}