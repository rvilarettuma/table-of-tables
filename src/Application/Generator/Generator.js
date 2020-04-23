import React, { Component } from 'react';
import { Container, Col, Row } from 'reactstrap';
import MainList from "./MainList";

export default class Generator extends Component {

  constructor(props) {
    super(props);
    this.mainList = React.createRef();
    this.renderMain = this.renderMain.bind(this);
    this.state = {
      currentCategory: "Dungeons and Locations",
      currentSubCategory: ""
    };
  }

  render() {
    return(
      <div>
        {this.renderMain()}
      </div>
    );
  }

  renderMain() {
    return (
      <Container>
        <Row>
          <Col xs={12} sm={12} md={3} lg={3} xl={3}>
            <MainList ref={this.mainList}/>
          </Col>
          <Col>
            <h1 className="display-4 text-md-center">{this.state.currentCategory}</h1>
            <hr className="my-2" />
            <p className="text-md-center">{this.state.currentSubCategory}</p>
          </Col>
        </Row>
      </Container>
    );
  }

}