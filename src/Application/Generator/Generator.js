import React, {Component} from 'react';
import {Container, Col, Row} from 'reactstrap';
import MainList from "./MainList";

export default class Generator extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentCategory: "Dungeons and Locations",
      currentSubCategory: "Basic Dungeons"
    };
    this.renderMain = this.renderMain.bind(this);
  }

  render() {
    return (
      <div>
        {this.renderMain()}
      </div>
    );
  }

  renderMain() {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <MainList/>
            </Col>
            <Col>
              <h1 className="display-4 text-md-center">{this.state.currentSubCategory}</h1>
              <hr className="my-2"/>
              <p className="text-md-center">{this.state.currentCategory}</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

}