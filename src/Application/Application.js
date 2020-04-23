import React, { Component } from 'react';
import About from './About/About';
import Home from './Home/Home';
import Generator from './Generator/Generator';

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
      case 'generate':
        return <Generator/>;
      default:
        return <Home setAppPage ={this.props.setAppPage}/>;
    }
  }
}