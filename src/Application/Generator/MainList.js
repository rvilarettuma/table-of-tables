import React, { Component } from 'react';
import { ListGroup } from 'reactstrap'
import items from './Lists/dl_list'

export default class MainList extends Component {

  constructor(props) {
    super(props);
    this.renderListItems = this.renderListItems.bind(this);
  }

  render() {
    return(
      <ListGroup>
        {this.renderListItems}
      </ListGroup>
    );
  }

}