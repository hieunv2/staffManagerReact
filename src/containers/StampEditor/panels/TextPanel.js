import React, {Component} from 'react';
import has from 'lodash/has';
import WebFont from 'webfontloader';
import PropertyGroup from './PropertyGroup';
import SwitchState from './SwitchState';
import Column from './Column';
import styles from './styles';

export default class TextPanel extends Component {
  fontFamilies = [
    {name: 'Noto Sans JP', family: 'Noto Sans JP'},
    {name: 'Noto Serif JP', family: 'Noto Serif JP'},
    {name: 'Sawarabi Gothic', family: 'Sawarabi Gothic'},
    {name: 'Sawarabi Mincho', family: 'Sawarabi Mincho'},
    {name: 'Kosugi', family: 'Kosugi'},
    {name: 'Kosugi Maru', family: 'Kosugi Maru'},
  ];

  handleFontFamilyChange = e => {
    const value = e.target.value;
    WebFont.load({
      google: {
        families: [value],
      },
    });
    this.props.onChange('fontFamily', value);
  };

  sortFonts = (f1, f2) =>
    f1.name.toLowerCase() > f2.name.toLowerCase()
      ? 1
      : f1.name.toLowerCase() < f2.name.toLowerCase()
      ? -1
      : 0;

  render() {
    let {object} = this.props;
    return (
      <PropertyGroup showIf={has(object, 'text')}>
        <div style={styles.columns}>
          <Column style={{float: 'right', marginRight: 15}}>
            {has(object, 'fontWeight') && (
              <SwitchState
                icon="format-bold"
                defaultValue={'normal'}
                nextState={'bold'}
                value={object.fontWeight}
                onChange={this.props.onChange.bind(this, 'fontWeight')}
              />
            )}
            {has(object, 'fontStyle') && (
              <SwitchState
                icon="format-italic"
                defaultValue={'normal'}
                nextState={'italic'}
                value={object.fontStyle}
                onChange={this.props.onChange.bind(this, 'fontStyle')}
              />
            )}
            {has(object, 'textDecoration') && (
              <SwitchState
                icon="format-underline"
                defaultValue={'none'}
                nextState={'underline'}
                value={object.textDecoration}
                onChange={this.props.onChange.bind(this, 'textDecoration')}
              />
            )}
          </Column>
          <Column style={{float: 'right'}}>
            {has(object, 'fontSize') && (
              <input
                style={{...styles.input, ...styles.integerInput, width: 35}}
                value={object.fontSize}
                onChange={e => this.props.onChange('fontSize', e.target.value)}
              />
            )}
          </Column>
          <Column style={{float: 'right', marginRight: 10}}>
            <select
              style={styles.select}
              value={object.fontFamily}
              onChange={this.handleFontFamilyChange}>
              {this.fontFamilies.sort(this.sortFonts).map(({name, family}) => (
                <option key={family} value={family}>
                  {name}
                </option>
              ))}
            </select>
          </Column>
          <div style={{...styles.row, paddingTop: 25, paddingRight: 10}}>
            <input
              style={{...styles.input, ...styles.textInput}}
              onChange={e => this.props.onChange('text', e.target.value)}
              value={object.text}
            />
          </div>
        </div>
      </PropertyGroup>
    );
  }
}
