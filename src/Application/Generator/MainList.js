import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import master_list from './Lists/master_list.json';

export default class MainList extends Component {

  constructor(props) {
    super(props);
    this.state ={
      category: 'Default Category',
      subcategory: 'Default Subcategory',
      dropdownOpen: false
    };
    this.renderList = this.renderList.bind(this);
  }

  render() {
    return(
      <div>
        <ListGroup>
          {this.renderList()}
        </ListGroup>
      </div>
    );
  }

  renderList() {
    const mlist = JSON.parse(JSON.stringify({master_list}));
    let items = [];
    for (let i = 0; i < mlist.master_list.length; i++) {
      Object.keys(mlist.master_list[i]).forEach(function(j) {
        Object.keys(mlist.master_list[i][j]).forEach(function(k) {
          if (mlist.master_list[i][j][k].header !== undefined) {
            items.push(<ListGroupItem key={'lg_' + k + mlist.master_list[i][j][k].header}>{mlist.master_list[i][j][k].header}</ListGroupItem>)
          } else {
            console.log(mlist.master_list[i][j][k].name);
          }
        });
      });
    }
    return(items);
  }

}