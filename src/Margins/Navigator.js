import React, {Component} from 'react';
import {Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';

export default class Navigator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  render() {
    return (
      <div className="navbar">
        <Navbar light>
          <NavbarBrand href="/" className="mr-auto">home</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2"/>
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink href="#" onClick={() => this.props.setAppPage('generate')}>Generator</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" onClick={() => this.props.setAppPage('about')}>About</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/rvilarettuma/table-of-tables">GitHub</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
}