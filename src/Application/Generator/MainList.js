import React, { Component } from 'react';
import { Button, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import master_list from './Lists/master_list.json';

export default class MainList extends Component {

  constructor(props) {
    super(props);
    this.state ={
      category: 'Default Category',
      subcategory: 'Default Subcategory',
      dropdownOpen: false,
      cat_btn_open: false
    };
    this.renderList = this.renderList.bind(this);
    this.toggleCat = this.toggleCat.bind(this);
  }

  render() {
    return(
      <div>
        <Button block outline onClick={this.toggleCat}>Categories</Button>
        <Collapse isOpen={this.state.cat_btn_open}>
          <Nav vertical>
            {this.renderList()}
          </Nav>
        </Collapse>
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
              <NavItem key={'lg_' + k + mlist.master_list[i][j][k].header}>
                <NavLink>{mlist.master_list[i][j][k].header}</NavLink>
              </NavItem>)
          } else {
            // console.log(mlist.master_list[i][j][k].name);
          }
        });
      });
    }
    return(items);
  }

  toggleCat() {
    this.setState({
      cat_btn_open: !this.state.cat_btn_open
    });
  }
}