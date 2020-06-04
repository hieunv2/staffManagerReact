import React, {Component} from 'react';
import has from 'lodash/has';
import PropertyGroup from './PropertyGroup';
import Columns from './Columns';
import Column from './Column';

export default class SizePanel extends Component {
  render() {
    let {object} = this.props;
    return (
      <PropertyGroup object={object}>
        {has(object, 'width', 'height') && (
          <Columns label="Size">
            <Column
              showIf={has(object, 'width')}
              label="width"
              value={object.width}
              onChange={this.props.onChange.bind(this, 'width')}
            />
            <Column
              showIf={has(object, 'height')}
              label="height"
              value={object.height}
              onChange={this.props.onChange.bind(this, 'height')}
            />
          </Columns>
        )}
        <Columns label="Position">
          <Column
            showIf={has(object, 'x')}
            label="top"
            value={object.x}
            onChange={this.props.onChange.bind(this, 'x')}
          />
          <Column
            showIf={has(object, 'y')}
            label="top"
            value={object.y}
            onChange={this.props.onChange.bind(this, 'y')}
          />
        </Columns>
        {has(object, 'rotate') && (
          <Columns label="Rotation">
            <Column
              label="angle"
              value={object.rotate}
              onChange={this.props.onChange.bind(this, 'rotate')}
            />
          </Columns>
        )}
      </PropertyGroup>
    );
  }
}
