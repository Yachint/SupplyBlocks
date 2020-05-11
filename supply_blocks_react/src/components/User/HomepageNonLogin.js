import React from "react";
import { Statistic, List, Typography } from "antd";
const { Title } = Typography;
const data = [
  "Login with metamask.",
  "Add your inventory details and info.",
  "Enjoy !!",
];
class HomePageNonLogin extends React.Component {
  render() {
      var userCount=0;
      var i=0;
    return (
      <div>
        <Title level={2}>Welcome to SCAB!</Title>
        <Title level={3}>The future of Supply Chain Management Systems</Title>
        <List
         size="small"
          header={<div>Join in 3 easy Steps:</div>}
    footer={<div><Statistic>{userCount}</Statistic> have already joined... What are you waiting for ? </div>}
          bordered
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>{++i}. </Typography.Text> {item}
            </List.Item>
          )}
        />
        <br />
      </div>
    );
  }
}

export default HomePageNonLogin;
