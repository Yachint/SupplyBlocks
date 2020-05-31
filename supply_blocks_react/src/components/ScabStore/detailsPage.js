import React from "react";
import { connect } from "react-redux";
import { fetchItems } from "../../actions/storeActions";
import { List, Typography } from "antd";
// import { Link } from "react-router-dom";
class DetailsPage extends React.Component {
  componentDidMount() {
    this.props.fetchItems(this.props.match.params.id);
  }
  state = {
    obj: {
      key: this.props.match.params.id,
      prodId: this.props.stores.prodId,
      name: this.props.stores.name,
      description: this.props.stores.description,
      toBuyPrice: this.props.stores.price,
      toBuyQuantity: this.props.match.params.count,
      seller: this.props.stores.seller,
      buyer: this.props.auth.userAddress,
      id:this.props.match.params.id,
      status: "CREATED"
    },
  };
  correctPrice(price) {
    if (!isNaN(price)) {
      return price;
    } else {
      return String(price).substring(1);
    }
  }
  renderData() {
    return [
      `Product Id: ${this.props.stores.prodId}`,
      `Product Name: ${this.props.stores.name}`,
      `Description: ${this.props.stores.description}`,
      `Price: ${this.props.stores.price}`,
      `Quantity Selected: ${this.props.match.params.count}`,
      `Final Price:  ${
        parseFloat(this.correctPrice(this.props.stores.price)) *
        parseFloat(this.props.match.params.count)
      }`,
    ];
  }
  renderObj=()=> {
    console.log(this.state.obj);
  }
  render() {
    if (!this.props.stores) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <List
          size="large"
          header={
            <div>
              <Typography.Text mark strong>
                <h2>Item Details:</h2>
              </Typography.Text>
            </div>
          }
          footer={
            <div>
              Checkout to see your buying options...
              <div className="right floated content">
                <div
                  className="ui animated button primary"
                  tabIndex="0"
                  onClick={this.renderObj}
                >
                  <div className="visible content">Checkout</div>
                  <div className="hidden content">
                    <i className="large dolly icon"></i>
                  </div>
                </div>
              </div>
            </div>
          }
          bordered
          dataSource={this.renderData()}
          renderItem={(item) => <List.Item>{item}</List.Item>}
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
    auth: state.auth
  };
};

export default connect(mapStateToProps, { fetchItems })(DetailsPage);
