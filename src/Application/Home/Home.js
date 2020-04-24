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
      <div>
        {this.renderJumbotron()}
      </div>
    );
  }

  renderJumbotron() {
    return (
      <Jumbotron className="text-center">
        <h1 className="display-3">Tabularium</h1>
        <hr className="my-2" />
        <p className="lead">random generation for the aspiring artist, creative, or tabletop gamer </p>
        {this.renderGetStarted()}
      </Jumbotron>
    );
  }

  renderGetStarted() {
    return (
      <Container>
        <Button className="pill-button text-center" outline onClick={() => {this.props.setAppPage('generate')}}>Get Started</Button>
      </Container>
    );
  }


}