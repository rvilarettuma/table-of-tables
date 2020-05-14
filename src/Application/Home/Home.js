import React, { Component } from 'react';
import { Container, Jumbotron, Button } from 'reactstrap';

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.renderJumbotron = this.renderJumbotron.bind(this);
    this.renderGetStarted = this.renderGetStarted.bind(this);
  }

  render() {
    return (
      <div className={"main-page"}>
        {this.renderJumbotron()}
      </div>
    );
  }

  renderJumbotron() {
    return (
      <Jumbotron fluid className={"jumbo"} >
        <Container>
          <h1 className="display-3">Tabularium</h1>
          <p className="lead">random generation for the aspiring artist, creative, or tabletop gamer </p>
          {this.renderGetStarted()}
        </Container>
      </Jumbotron>
    );
  }

  renderGetStarted() {
    return (
      <Container>
        <Button className="pill-button text-center" outline onClick={() => {this.props.setAppPage('generate')}}>get started</Button>
      </Container>
    );
  }


}