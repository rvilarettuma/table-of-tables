import React, { Component } from 'react';
import {
  ButtonDropdown,
  Container,
  Col,
  Row,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';


export default class Generator extends Component {

  constructor(props) {
    super(props);

    this.state = {
      category: 'Default Category',
      subcategory: 'Default Subcategory',
      dropdownOpen: false
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  render() {
    return(
      <Container>
        <Row>
          <Col xs={12} sm={12} md={3} lg={3} xl={3}>
            {this.renderList()}
          </Col>
          <Col>
              <h1 className="display-4 text-md-center">{this.state.category}</h1>
              <hr className="my-2" />
              <p className="text-md-center">{this.state.subcategory}</p>
          </Col>
        </Row>
      </Container>
    );
  }

  renderList() {
    const titles = ['Dungeons and Locations', 'Factions/Groups', 'Food', 'Magic', 'Monsters', 'NPCs', 'Objects, Items, etc.', 'Plot', 'Settlements', 'Wilderness'];
    let items = [];
    let ttl;
    let type = 'dropitem_';
    for (ttl in titles) {
      items.push(<DropdownItem key={type.concat(ttl)}>{titles[ttl]}</DropdownItem>);
    }
    return (
      <div>
        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
          <DropdownToggle caret>
            Categories
          </DropdownToggle>
          <DropdownMenu>
            {items}
          </DropdownMenu>
        </ButtonDropdown>

      </div>
    );
  }

  toggleDropdown() {
     this.setState({
        dropdownOpen: !this.state.dropdownOpen
     });
  }
}