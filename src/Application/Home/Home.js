import React, { Component } from 'react';
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
          <h4 className="text-uppercase">Categories</h4>
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
    let items =  this.renderListItems();
    return (
      <div>
        <ListGroup>
          {items}
        </ListGroup>
      </div>
    );
  }

  renderListItems() {
    const titles = ['Dungeons and Locations', 'Factions/Groups', 'Food', 'Magic', 'Monsters', 'NPCs', 'Objects, Items, etc.', 'Plot', 'Settlements', 'Wilderness'];
    let items = [];
    let ttl;
    for (ttl in titles) {
      items.push(<ListGroupItem tag={"button"} action onClick={()=>this.props.setAppPage('generate')}>{titles[ttl]}</ListGroupItem>);
    }
    return items;
  }

}