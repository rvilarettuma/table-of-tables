import React, {Component} from 'react';
import { Jumbotron, ListGroup, ListGroupItem } from 'reactstrap';

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.renderJumbotron = this.renderJumbotron.bind(this);
    this.renderCategories = this.renderCategories.bind(this);
  }

  render() {
    return (
      <div>
        {this.renderJumbotron()}
        <div className="container">
          <h5>Categories</h5>
          {this.renderCategories()}
        </div>
      </div>
    );
  }

  renderJumbotron() {
    return (
      <Jumbotron>
        <h1 className="display-3">Tabularium</h1>
        <hr className="my-2" />
        <p className="lead">random generation for the aspiring artist, creative, or tabletop gamer </p>
      </Jumbotron>
    );
  }

  renderCategories() {
    return (
      <div>
        <ListGroup>
          <ListGroupItem tag={"button"} action>Dungeons and Locations</ListGroupItem>
          <ListGroupItem tag={"button"} action>Factions/Groups</ListGroupItem>
          <ListGroupItem tag={"button"} action>Food</ListGroupItem>
          <ListGroupItem tag={"button"} action>Magic</ListGroupItem>
          <ListGroupItem tag={"button"} action>Monsters</ListGroupItem>
          <ListGroupItem tag={"button"} action>NPCs</ListGroupItem>
          <ListGroupItem tag={"button"} action>Objects, Items, Etc.</ListGroupItem>
          <ListGroupItem tag={"button"} action>Plot</ListGroupItem>
          <ListGroupItem tag={"button"} action>Settlements</ListGroupItem>
          <ListGroupItem tag={"button"} action>Wilderness</ListGroupItem>
        </ListGroup>
      </div>

    );
  }

}