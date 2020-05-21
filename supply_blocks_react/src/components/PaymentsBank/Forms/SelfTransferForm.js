import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Input, Button } from 'antd';

const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 5,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
    },
};
  const tailLayout = {
    wrapperCol: {
      offset: 10,
      span: 16,
    },
};

class SelfTransferForm extends React.Component {

    onSubmit = (formValues) => {
        // console.log(formValues);
        this.props.onSubmit(formValues);
    }

    renderError({error, touched}){
        if(error && touched){
            return "error";
        }
        else if (!error && touched) {
            return "success";
        }
        else{
            return "";
        }
    }

    renderInput = (formProps) => {
        return (
            <Form.Item
            label={formProps.label}
            validateStatus={this.renderError(formProps.meta)}
            help= {this.renderError(formProps.meta) === "error" ? formProps.meta.error : ""}
            >
                <Input 
                placeholder={formProps.placeholder} 
                addonAfter={formProps.addonAfter === "None" ? '' : formProps.addonAfter}
                id={`${formProps.name}id`}
                {...formProps.input}
                 />
                
            </Form.Item>
        );
    }

    render(){
        return(
            <Form onFinish={this.props.handleSubmit(this.onSubmit)} {...formItemLayout}>

            <Field 
            name="amount" 
            component={this.renderInput}
            label="Enter Amount" 
            addonAfter="ETH"
            placeholder="Ex: 10 ETH" />

            <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
            Submit
            </Button>
            </Form.Item>  

            </Form>
        );
        
    }
}

const validateForm = (formValues) => {
    const errors = {}

    if(!formValues.amount){
        errors.amount = 'Please enter an Amount';
    } else {
        var checkAmount = /^\d+(\.\d{1,2})?$/;
        if(!checkAmount.test(formValues.amount)){
            errors.amount = 'Enter valid Amount!'
        }
    }

    return errors;
}

export default reduxForm({
    form: 'SelfTransferForm',
    validate: validateForm
})(SelfTransferForm);