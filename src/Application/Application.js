import React, { Component } from 'react';
import About from './About/About';
import Home from './Home/Home';

export default class Application extends Component {

  render() {
    let pageToRender = this.props.page;
    return (
      <div>
        {this.createApplicationPage(pageToRender)}
      </div>
    );
  }

  createApplicationPage(pageToRender) {
    switch (pageToRender) {
      case 'about':
        return <About/>;
      // case 'settings':
      //   return <Settings/>
      default:
        return <Home/>;
    }
  }
}