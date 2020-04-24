import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import master_list from './Lists/master_list.json';

export default class MainList extends Component {

  constructor(props) {
    super(props);
    this.state ={
      category: 'Default Category',
      subcategory: 'Default Subcategory',
      dropdownOpen: false,
      cat_btn_open: false,
      active: "default"
    };
    this.renderList = this.renderList.bind(this);
    this.toggleCat = this.toggleCat.bind(this);
    this.handleNavClick = this.handleNavClick.bind(this);
  }

  render() {
    return(
      <div className="sidebar">
          <ListGroup flush>
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
            items.push(
              <ListGroupItem disabled className="text-uppercase" key={'lg_' + k + mlist.master_list[i][j][k].header}>{mlist.master_list[i][j][k].header}</ListGroupItem>)
          } else {
            items.push(
              <ListGroupItem key={'lg0_' + k + mlist.master_list[i][j][k].name}>{mlist.master_list[i][j][k].name}</ListGroupItem>
            )
          }
        });
      });
    }
    return(items);
  }

  handleNavClick() {
    console.log("pressed");
  }

  toggleCat() {
    this.setState({
      cat_btn_open: !this.state.cat_btn_open
    });
  }
}