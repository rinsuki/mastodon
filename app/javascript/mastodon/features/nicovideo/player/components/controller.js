import React from 'react';
import PropTypes from 'prop-types';

export default class Controller extends React.PureComponent {

  static propTypes = {
    videoId: PropTypes.string,
    input: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onClickPlay: PropTypes.func.isRequired,
    onClickCopy: PropTypes.func.isRequired,
  }

  handleChange = () => {
    this.props.onChange(this.input.value);
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
    const { input, videoId } = this.props;

    if (this.isCopyMode()) {
      this.props.onClickCopy(videoId);
    } else {
      this.props.onClickPlay(input);
    }
  }

  isCopyMode() {
    const { videoId, input } = this.props;
    return videoId && input === videoId;
  }

  buttonText() {
    if (this.isCopyMode()) {
      return { icon: 'fa-pencil-square-o', text: '動画ID' };
    } else {
      return { icon: 'fa-play', text: '再生' };
    }
  }

  setRef = (c) => {
    this.input = c;
  }

  render() {
    const { input } = this.props;
    const { icon, text } = this.buttonText();
    const button = (
      <button
        className='button nico-video-player__item__btn'
        onClick={this.handleSubmit}
      >
        <i className={`fa ${icon}`} />
        {text}
      </button>
    );

    return (
      <div className='nico-video-player__item__controls'>
        <input
          type='text'
          className='nico-video-player__item__input'
          value={input}
          placeholder='sm9'
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          ref={this.setRef}
          pattern='(sm|so)\d*'
        />
        {button}
      </div>
    );
  }

};
