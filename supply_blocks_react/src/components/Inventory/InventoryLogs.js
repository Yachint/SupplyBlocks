import React from 'react';
// import data from './Fixed/Data';
import { Collapse, Table, Empty, Divider } from 'antd';
const { Panel } = Collapse;


const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
    },
    {
      title: 'DHT_Hash',
      dataIndex: 'DHT_Hash',
      key: 'DHT_Hash',
    }
];

const TxColumns = [
    {
      title: 'Product Id',
      dataIndex: 'prodId',
      key: 'prodId',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
        title: 'Action Taken',
        dataIndex: 'action',
        key: 'action'
    }

]

const InventoryLogs = (props) => {

    const  { data } = props;

    const getRows = () => {
        let i = 0;

        data.forEach(item => {
            item.key = i++;
            let date = new Date(item.timestamp);
            let toString = ''+date;
            item.timestamp = toString.substring(0,24);
            item.transactions.forEach(tx => {
                if(tx.details.changedState.delete === 'true'){
                    tx.details.changedState.action = 'DELETE'
                } else {
                    tx.details.changedState.action = 'ADD/EDIT'
                }
            })
        });

        return data.map(item => {
            return (<Panel header={item.timestamp} key={item.timestamp}>
                <Table dataSource={[item]} columns={columns} />
                <Collapse>
                    {item.transactions.map(tx => {
                        return <Panel header={"Transaction id :"+tx.transactionid} key={tx.transactionid}>
                            <Table dataSource={[tx.details.changedState]} columns={TxColumns}></Table>
                        </Panel>
                    })}
                </Collapse>
            </Panel>);
        });
    }

    return(
        <React.Fragment>
        <h2>Inventory Logs :</h2>
        <Divider />
        {data.length === 0 ? <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
                height: 60,
            }}
            description={
                <span>
                        No Inventory Logs Associated with this Address.
                </span>
            }
            ></Empty> : <Collapse>
            {getRows()}
        </Collapse>}
        <br/><br/>
        </React.Fragment>
    );

}

export default InventoryLogs;