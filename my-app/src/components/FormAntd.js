import React from 'react';
import { Form,Input,Button} from 'antd';



class FormAntd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        const {validateFields}=this.props.form;
        validateFields((err,values)=>{
            if(!err){
                console.log("submit data",values)
            }
        })

    }
    render() { 
        const {getFieldDecorator}=this.props.form
        return ( 
            <Form onSubmit={(e)=>this.handleSubmit(e)}>
                <Form.Item>
                    {
                        getFieldDecorator("username",{
                            rules:[{required:true,message:'please enter username'}]
                        })(
                            <Input placeholder="请输入用户名"/>
                        )
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator("password",{
                            rules:[{required:true,message:'please enter password'}]
                        })(
                            <Input type="password" placeholder="请输入密码" />
                        )
                    }
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">登录</Button>
                </Form.Item>
            </Form>
         );
    }
}
 
const WithFormAntd=Form.create({name:'form-login'})(FormAntd)
export default WithFormAntd;