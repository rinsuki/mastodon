import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';

export default class ToggleButton extends React.PureComponent {

  static propTypes = {
    onToggle: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired,
  };

  onChange = ({ target }) => {
    this.props.onToggle(target.checked);
  };

  render () {
    const { checked } = this.props;
    const toggleStyle = {
      marginRight: '0px',
      marginLeft: 'auto',
      marginTop: '6px',
    };

    return (
      <div className='setting-toggle' style={toggleStyle} id='nico_video_toggle'>
        <Toggle onChange={this.onChange} checked={checked} />
      </div>
    );
  }

};
