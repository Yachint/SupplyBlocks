import React from "react";
import { Statistic, List, Typography } from "antd";
import { connect } from "react-redux";
import { fetchAllItems } from "../../actions/storeActions";
import { Link } from "react-router-dom";
const { Title } = Typography;

class MainPage extends React.Component {
  componentDidMount() {
    this.props.fetchAllItems();
  }
  renderAdmin(stream) {
    return (
      <div className="right floated content">
        <Link to={`/DetailsPage/${stream.id}`} className="ui button primary">
          Details
        </Link>
      </div>
    );
  }
  renderList() {
    return this.props.stores.map((stream) => {
      return (
        <div className="item" key={stream.id}>
          {this.renderAdmin(stream)}
          <i className="big dolly icon" />
          <div className="content">
            {stream.name}
            <div className="description">{stream.description}</div>
            <div className="description">{stream.price}</div>
          </div>
        </div>
      );
    });
  }
  render() {
    return (
      <div>
        <Title level={2}>Welcome to SCAB Store</Title>
        <Title level={3}>Items Available:</Title>
        <div className="ui celled list">{this.renderList()}</div>{" "}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    stores: Object.values(state.store)
  };
};

export default connect(mapStateToProps, { fetchAllItems })(MainPage);
