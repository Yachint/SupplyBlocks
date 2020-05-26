import React from "react";
import { connect } from "react-redux";
import { fetchItems } from "../../actions/storeActions";
import { Statistic, List, Typography } from "antd";
class DetailsPage extends React.Component {
  componentDidMount() {
    this.props.fetchItems(this.props.match.params.id);
  }
  renderData(){
    return [
        `Product Id: ${this.props.stores.prodId}`,
        `Product Name: ${this.props.stores.name}`,
        `Description: ${this.props.stores.description}`,
        `Price: ${this.props.stores.price}`,
        `Quantity Available: ${this.props.stores.quantity}`,
      ];
  }
  render() {
    if (!this.props.stores) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <List
          size="large"
          header={<div><Typography.Text mark strong>Item Details:</Typography.Text></div>}
          footer={
            <div>
              Checkout to see your buying options...
            </div>
          }
          bordered
          dataSource={this.renderData()}
          renderItem={(item) => (
            <List.Item>
              {item}
            </List.Item>
          )}
        />
        {/*           
        <div className="content">
          {this.props.stores.name}
          <div className="description">{this.props.stores.description}</div>
          <div className="description">{this.props.stores.price}</div>
        </div> */}
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    stores: state.store[ownProps.match.params.id],
  };
};

export default connect(mapStateToProps, { fetchItems })(DetailsPage);
