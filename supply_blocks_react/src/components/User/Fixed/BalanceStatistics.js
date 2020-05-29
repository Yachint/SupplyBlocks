import React, { useState } from 'react';
import { Statistic, Card, Row, Col, Switch } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import './BalanceStatistics'

const BalanceStatistics = (props) => {

    const { balance, stats } = props;
    const { txNumber, moneySpent, moneyEarned } = stats;

    const [currency, setCurrency] = useState('ETH');

    const onCurrencyChange = () => {
        if(currency === 'ETH') setCurrency('$');
        else setCurrency('ETH');
    }

    return(
        <div className="site-statistic-demo-card">
            <Switch style={{float: 'right'}} checkedChildren='$' unCheckedChildren='ETH' onChange={onCurrencyChange} />
            <br/><br/>
            <Row gutter={16}>
            <Col span={12}>
                <Card>
                <Statistic
                    title="Contract Balance"
                    value={currency === 'ETH' ? balance : balance*219}
                    precision={2}
                    valueStyle={{ color: "#0099ff" }}
                    suffix={currency === 'ETH' ? 'ETH' : '$'}
                />
                </Card>
            </Col>
            <Col span={12}>
                <Card>
                <Statistic
                    title="Number of Transactions"
                    value={txNumber}
                    precision={0}
                    valueStyle={{ color: "#00000" }}
                    suffix="Tx"
                />
                </Card>
            </Col>
            </Row>
            <Row gutter={16}>
            <Col span={12}>
                <Card>
                <Statistic
                    title="Profit"
                    value={currency === 'ETH' ? moneyEarned : moneyEarned*219}
                    precision={2}
                    valueStyle={{ color: "#3f8600" }}
                    prefix={<ArrowUpOutlined />}
                    suffix={currency === 'ETH' ? 'ETH' : '$'}
                />
                </Card>
            </Col>
            <Col span={12}>
                <Card>
                <Statistic
                    title="Loss"
                    value={currency === 'ETH' ? moneySpent : moneySpent*219}
                    precision={2}
                    valueStyle={{ color: "#cf1322" }}
                    prefix={<ArrowDownOutlined />}
                    suffix={currency === 'ETH' ? 'ETH' : '$'}
                />
                </Card>
            </Col>
        </Row>
    </div>
    );
}

export default BalanceStatistics;