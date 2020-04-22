import React, { Component } from 'react';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import rvtImage from "./Images/rvt.png";

export default class About extends Component {

  render() {
    return (
      <Card>
        <CardBody>
          <CardImg top width="100%" src={rvtImage} alt="Richard Vilaret-Tuma Portrait" />
          <CardTitle tag="h3" className="text-center">Richard Vilaret-Tuma</CardTitle>
          <CardSubtitle className="text-center">Primary Developer</CardSubtitle>
        </CardBody>
      </Card>
    );
  }
}