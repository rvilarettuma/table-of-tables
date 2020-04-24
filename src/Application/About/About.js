import React, { Component } from 'react';
import {Media } from 'reactstrap';
import rvtImage from "./Images/rvt.gif";

export default class About extends Component {

  render() {
    return (
      <div className="container-md">
        {this.renderContainer()}
      </div>
    );
  }

  renderContainer() {
    return (
        <Media className="mt-lg-auto">
          <Media>
            <Media object src={rvtImage} alt="Richard Vilaret-Tuma Bitmoji Portrait"/>
          </Media>
          <Media body bottom>
            <Media heading>
              Richard Vilaret-Tuma
            </Media>
            <h5 className="medium"> Primary Developer</h5>
            <p>A senior at Colorado State University, majoring in Applied Computing Technology. This project is being developed for credit for CS495 - Independent Study.</p>
            <p>All tables sourced with permission from user OrkishBlade on <a href="https://www.reddit.com/r/BehindTheTables/">/r/BehindTheTables</a></p>
          </Media>
        </Media>
    );
  }
}