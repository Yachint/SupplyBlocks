import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Input, Select, Button } from 'antd';
const { Option } = Select;

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

class ContractForm extends React.Component {

    onSubmit = (formValues) => {
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
            hasFeedback
            validateStatus={this.renderError(formProps.meta)}
            help= {this.renderError(formProps.meta) === "error" ? formProps.meta.error : ""}
            >
                <Input 
                placeholder={formProps.placeholder} 
                id={`${formProps.name}id`}
                {...formProps.input}
                 />
                
            </Form.Item>
        );
    }

    renderMultiSelect = (formProps) => {
        //console.log(formProps)
        return (<Form.Item
            name={formProps.name}
            label={formProps.label}
            
            hasFeedback
            rules={[
                {
                  type: 'array'
                },
              ]}
          >
            <Select mode="multiple" placeholder="Please select a category" 
            {...formProps.input}
            onBlur={() => {
                formProps.input.onBlur([...formProps.input.value])
              }
            }
            value={formProps.input.value === '' ? [] : formProps.input.value}
            >
              <Option value="Processed Food">Processed Food</Option>
              <Option value="Raw Materials">Raw Materials</Option>
              <Option value="Electronics">Electronics</Option>
              <Option value="Clothing">Clothing</Option>
            </Select>
          </Form.Item>
        );
    }

    render(){
        return(
            <Form onFinish={this.props.handleSubmit(this.onSubmit)} {...formItemLayout}>
            <Field 
            name="orgName" 
            component={this.renderInput}
            label="Organisation Name" 
            placeholder="Ex: ABC Manufacturers" />

            <Field 
            name="description" 
            component={this.renderInput}
            label="Description"
            placeholder="Ex: We only sell the best quality!" />

            <Field 
            name="name" 
            component={this.renderInput}
            label="Employee Name" 
            placeholder="Ex: John Doe" />

            <Field 
            name="designation" 
            component={this.renderInput}
            label="Designation"
            placeholder="Ex: Chief Executive of Sales" />

            <Field 
            name="companyAddress" 
            component={this.renderInput}
            label="Company Address" 
            placeholder="Ex: 102, Baker Street, London" />

            <Field 
            name="warehouseAddress"
            component={this.renderInput}
            label="Warehouse Address"
            placeholder="Ex: Port 451, Bengaluru, India"
            />

            <Field 
            name="productCategories"
            defaultValue={[]}
            component={this.renderMultiSelect}
            label="Product Categories"
            />

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

    if(!formValues.orgName){
        errors.orgName = 'Please enter an Organisation Name';
    }

    if(!formValues.description){
        errors.description = 'Please enter a Description';
    }

    if(!formValues.name){
        errors.name = 'You must enter a name!';
    }else{
        var checkName = /^[a-zA-Z ]*$/;
        if(!checkName.test(formValues.name)){
            errors.name = 'Name should only contain Alphabets!';
        }
    }

    if(!formValues.designation){
        errors.designation = 'Please enter a Designation';
    }

    if(!formValues.companyAddress){
        errors.companyAddress = 'Please enter an Company Address';
    }

    if(!formValues.warehouseAddress){
        errors.warehouseAddress = "Please enter a Warehouse Address";
    }

    if(formValues.productCategories === ""){
        errors.productCategories = "Please select at least 1 Category"
    }

    return errors;
}

export default reduxForm({
    form: 'ContractForm',
    validate: validateForm
})(ContractForm);