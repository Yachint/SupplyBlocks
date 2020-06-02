const columns = [
    {
      title: 'Order Id',
      dataIndex: 'orderId',
      key: 'orderId',
      editable: false
    },
    {
      title: 'Product Id',
      dataIndex: 'prodId',
      key: 'prodId',
      editable: false
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: false
    },
    {
        title: 'Paid Price',
        dataIndex: 'toBuyPrice',
        key: 'toBuyPrice',
        editable: false
    },
    {
        title: 'Quantity',
        dataIndex: 'toBuyQuantity',
        key: 'toBuyQuantity',
        editable: false
    },
    {
        title: 'Buyer',
        dataIndex: 'buyer',
        key: 'buyer',
        editable: false
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        editable: true
    }
];

export default columns;