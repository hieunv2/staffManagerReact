import React from 'react';
import Vector from './Vector';

export default class Line extends Vector {
  static meta = {};

  render() {
    // let {object, index} = this.props;
    return <line style={this.getStyle()} {...this.getObjectAttributes()} />;
  }
}
