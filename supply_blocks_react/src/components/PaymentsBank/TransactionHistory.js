import React from 'react';
import { Button } from 'antd'
import { Collapse, Table, Empty } from 'antd';
const { Panel } = Collapse;

const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Address',
      dataIndex: 'from',
      key: 'from',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
    }
];

const TransactionHistory = (props) => {

    const { handleRefresh, bankHistory } = props;

    const getRows = () => {

        let i = Math.random()*100;
        let j = Math.random()*1000;

        bankHistory.forEach(item => {
            if(item !== null){
                item.key = i;
                i++;
            }
            
        });

        return bankHistory.map(item => {
            if(item !== null){
                return <Panel header={item.timestamp} key={j++}>
                <Table dataSource={[item]} columns={columns}/>
                </Panel>
            }
            return <React.Fragment></React.Fragment>
        })
    }

    return(<React.Fragment>
            <Button onClick={handleRefresh}>
                Click to refresh
            </Button>

            <br/>

            {bankHistory.length === 0 ? <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
                height: 60,
            }}
            description={
                <span>
                        No Transaction Logs Associated with this Address.
                </span>
            }
            ></Empty> : <Collapse>
            {getRows()}
            </Collapse>}
            <br/><br/>


        </React.Fragment>
    );

}

export default TransactionHistory;