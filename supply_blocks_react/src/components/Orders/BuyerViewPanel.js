import React from 'react'
import { Table, Button, Divider, Space } from 'antd';


const BuyerViewPanel = (props) => {

    const columnsBuyer = [
        {
          title: 'Order Id',
          dataIndex: 'orderId',
          key: 'orderId'
        },
        {
          title: 'Product Id',
          dataIndex: 'prodId',
          key: 'prodId'
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name'
        },
        {
            title: 'Paid Price',
            dataIndex: 'toBuyPrice',
            key: 'toBuyPrice'
        },
        {
            title: 'Quantity',
            dataIndex: 'toBuyQuantity',
            key: 'toBuyQuantity'
        },
        {
            title: 'Buyer',
            dataIndex: 'buyer',
            key: 'buyer'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <Space size="middle">
                <Button>View</Button>
              </Space>
            )
        }
    ];


    return(
        <React.Fragment>
            <h2>Progress of Orders :</h2>
            <Divider />
            <Button onClick={props.handleRefresh}>
                    Click to refresh
            </Button>
            <Table columns={columnsBuyer} dataSource={props.data} />
        </React.Fragment>
    );

}

export default BuyerViewPanel;