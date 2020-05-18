import React, { useState, useEffect } from 'react';
import { Table, Form, Popconfirm, Button, Space, Divider } from 'antd';
import SimpleColumns from './Fixed/Columns';
// import FixedData from './Fixed/Data';
import EditableCell from './Fixed/EditableCell';

const Inventory = (props) => {

    const editOps = {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Button>{addRowKey === -1 ? <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button>Cancel</Button>
            </Popconfirm> : <Popconfirm title="Sure to cancel?" onConfirm={() => cancelRow(record.key)}>
              <Button>Cancel</Button>
            </Popconfirm>
            }
          </span>
        ) : (
          <Button disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Button>
        );
      },
    };

    const deleteOps = {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick = {() => {handleDelete(record.key)}}>Delete</Button>
        </Space>
      ),
    };

    const columns = SimpleColumns.map(p => p);
    columns.push(deleteOps);
    columns.push(editOps);
    const [form] = Form.useForm();
    const {reduxData, reduxSetData, reduxDelete} = props;
    const [data, setData] = useState(reduxData);
    // console.log('DATA :',data);

    useEffect(() => {
      setData(reduxData);
    },[reduxData])

    const [editingKey, setEditingKey] = useState('');
    const [addRowKey, setAddRowKey] = useState(-1);

    const isEditing = record => record.key === editingKey;

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
          return col;
        }
    
        return {
          ...col,
          onCell: record => ({
            record,
            inputType: col.dataIndex === 'quantity' ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        };
      });

    const edit = record => {
      form.setFieldsValue({
        prodId: '',
        name: '',
        description: '',
        price: '',
        quantity: '',
        ...record,
      });
      setEditingKey(record.key);
    };

    const cancel = () => { setEditingKey(''); };

    const cancelRow = (key) => {
      setEditingKey('');
      setAddRowKey(-1);
      handleDelete(key);
    }

  const save = async key => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
        reduxSetData(newData);
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
        reduxSetData(newData);
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
    setAddRowKey(-1);
    
  };

  const handleDelete = key => {
    const dataSource = [...data];
    const deleteItem = dataSource.find(p => p.key === key);
    const ds = dataSource.filter(item => item.key !== key)
    var i = 0;
    ds.forEach(item => {
      item.key = i+1;
      i++;
    })
    setData(ds);
    deleteItem.delete = 'true';
    // console.log(deleteItem);
    reduxDelete(ds, deleteItem);
  };

  const handleAdd = () => {
    const count = data.length+1;
    // const { count, dataSource } = this.state;
    const newData = {
      key: count,
      prodId: '',
      name: ``,
      description: '',
      price: '',
      quantity: '',
    };
    setData([...data,newData]);
    setAddRowKey(newData.key);
    edit(newData);
    // this.setState({
    //   dataSource: [...dataSource, newData],
    //   count: count + 1,
    // });
  };
  

    return(
        <Form form={form} component={false}>
        <h2>Inventory Management :</h2>
        <Divider />
        <Button
          onClick={handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Add a row
        </Button>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
    );
};

export default Inventory;