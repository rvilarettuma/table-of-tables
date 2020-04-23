import React, { Component } from 'react';
import { Jumbotron, ListGroup, ListGroupItem } from 'reactstrap';
import {CATEGORIES} from "../Constants";

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
    const titles = {CATEGORIES}.CATEGORIES;
    let items = [];
    let ttl;
    let type = 'listitem_';
    for (ttl in titles) {
      items.push(<ListGroupItem key={type.concat(ttl)} tag={"button"} action onClick={()=>this.props.setAppPage('generate')}>{titles[ttl]}</ListGroupItem>);
    }
    return items;
  }

}