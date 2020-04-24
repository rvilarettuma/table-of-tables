import React, { Component } from 'react';
import Navigator from './Margins/Navigator';
import Application from './Application/Application';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.pages = [
      { title: 'Table of Tables', page: ''},
      { title: 'About', page: 'about'},
      { title: 'Home', page: 'home'},
      { title: 'Generator', page: 'generate'}
    ];
    this.state = {
      current_page: this.pages[0].page
    };
    this.setAppPage = this.setAppPage.bind(this);
  }

  render() {
    return (
      <div>
        <Navigator pages={this.pages} setAppPage={this.setAppPage}/>
        <Application page={this.state.current_page} setAppPage={this.setAppPage}/>
      </div>
    );
  }

  setAppPage(page) {
    this.setState({current_page: page});
  }
}
