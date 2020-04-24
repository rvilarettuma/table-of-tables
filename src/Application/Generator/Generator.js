import React, {Component} from 'react';
import {Button, Container, Col, Row} from 'reactstrap';
import MainList from "./MainList";

export default class Generator extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentCategory: "Dungeons and Locations",
      currentSubCategory: "Basic Dungeon",
      currentDescription: "A basic, bare bones dungeon.",
      file: "dl_basic_dungeon",
      file_data: []
    };
    this.renderMain = this.renderMain.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.setName = this.setName.bind(this);
    this.roll = this.roll.bind(this);
  }

  componentDidMount() {
    this.fetchData()
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
                {this.renderContent()}
                <Button block outline onClick={this.roll}>Roll</Button>
              </Col>
          </Row>
        </Container>
      </div>
    );
  }

  renderContent() {
    let items = [];
    let d = this.state.file_data;
    Object.keys(d).forEach((i) => {
      items.push(<p key={'p_' + i}>{d[i].sentence}</p>)
    });
    return (items);
  }

  fetchData() {
    fetch(`dl_tables/${this.state.file}.json`)
      .then((res) => res.json())
      .then(data => this.setState({file_data: data}))
      .catch(err => console.error(err));
  }

  roll() {

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