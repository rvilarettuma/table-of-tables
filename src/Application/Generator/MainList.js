import React, { Component } from 'react';
// import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem } from 'reactstrap'

export default class MainList extends Component {

  constructor(props) {
    super(props);
    this.state ={
      category: 'Default Category',
      subcategory: 'Default Subcategory',
      dropdownOpen: false
    };

  }

  render() {
    return(
      <div>
        <h1>List</h1>
      </div>
    );
  }

}