import React, { Component } from 'react';
import Part from '../part';

export default class BookPage extends Component {
  render() {
    return <Part navigation={this.props.navigation}/>;
  }
}
