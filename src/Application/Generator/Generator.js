import React, {Component} from 'react';
import {Container, Col, Row} from 'reactstrap';
import MainList from "./MainList";

export default class Generator extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentCategory: "Dungeons and Locations",
      currentSubCategory: "Basic Dungeon",
      currentDescription: "A basic, bare bones dungeon.",
      file: "dl_basic_dungeon"
    };
    this.renderMain = this.renderMain.bind(this);
    this.setName = this.setName.bind(this);
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
              <MainList setName={this.setName}/>
            </Col>
            <Col>
              <h1 className="display-4 text-md-center">{this.state.currentSubCategory}</h1>
              <h5 className="text-md-center">{this.state.currentCategory}</h5>
              <hr className="my-2"/>
              <p className="font-italic text-sm-center">{this.state.currentDescription}</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  setName(c,s,d,f) {
    this.setState({
      currentCategory: c,
      currentSubCategory: s,
      currentDescription: d,
      file: f
    });
  }

}