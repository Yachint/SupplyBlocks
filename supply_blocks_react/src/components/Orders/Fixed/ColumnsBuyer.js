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
            <a>View</a>
          </Space>
        )
    }
];

export default columnsBuyer;