import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import emojify from '../../../emoji';
import Immutable from 'immutable';

export default class EnqueteContent extends React.PureComponent {

  componentWillMount(){
    const created_at = Date.parse(this.props.status.get('created_at'));
    const id = this.props.status.get('id');
    if(Immutable.Map(JSON.parse(this.props.status.get('enquete'))).get('type') == 'enquete_result') {
      this.setState({ alive:false });
    } else {
      const isAlreadyVoted = this.readVoteHistory(id);
      if(isAlreadyVoted != null){
        this.props.onVoteLoad(id, isAlreadyVoted);
      }
      if(Date.now() - created_at > 30 * 1000){
        //already dead enquete when rendered
        this.props.onEnqueteTimeout(id);
        this.setState({
          alive: false,
          time_created: created_at,
          time_remaining: -1,
        });
      } else {
        //still alive enquete
        this.setState({
          alive: true,
          time_created: created_at,
          time_remaining: 30,
        });
      }
    }
  };

  readVoteHistory(id){
    let result = null;

    const cookieName = 'vote_to_' + String(id) + '=';
    const allCookies = document.cookie;
    const position = allCookies.indexOf(cookieName);
    if(position != -1){
      var startIndex = position + cookieName.length;
      var endIndex   = allCookies.indexOf(';', startIndex);
      if(endIndex == -1){
        endIndex = allCookies.length;
      }
      result = allCookies.substring(startIndex, endIndex);
    }
    return result;
  }

  tick(){
    const tr = 30 - (Date.now() - this.state.time_created) / 1000;
    if(tr < 0){
      clearInterval(this.interval);
      this.setState({ time_remaining: -1 });
      this.props.onEnqueteTimeout(this.props.status.get('id'));

    }else{
      this.setState({ time_remaining: tr.toFixed(2) });
    }
  };

  componentDidMount(){
    if(this.state.alive){
      this.interval = setInterval(this.tick.bind(this), 30);
    }
  };

  componentWillUnmount(){
    clearInterval(this.interval);
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    onVote: PropTypes.func,
    onVoteLoad: PropTypes.func,
    onEnqueteTimeout: PropTypes.func,
  };

  // call onVote
  handleEnqueteButtonClick = (e) => {
    const index = e.currentTarget.getAttribute('data-number');
    this.props.onVote(this.props.status.get('id'), index);
  }

  render () {

    const { status } = this.props;
    const enqueteStatus = Immutable.Map(JSON.parse(status.get('enquete')));

    const question = enqueteStatus.get('question');
    const questionContent = { __html: emojify(question) };

    const gauge_width = {
      width: String((30 - this.state.time_remaining) / 30 * 100) + '%',
    };

    let itemsContent;

    if (enqueteStatus.get('type') === 'enquete') {

      const timeCountGaugeContent =(
        <div className='enquete-deadline'>
          <div className='enquete-gauge'>
            <div className='enquete-gauge-outer'>
              <div className='enquete-gauge-inner' style={gauge_width}>
                <i className='tv-chan nico-account-button__icon' />
              </div>
            </div>
          </div>
          <div className='enquete-time'>
            {status.get('enquete_timeout') ? '終了' : this.state.time_remaining}
          </div>
        </div>);

      if (status.get('vote') || status.get('enquete_timeout')) {
        const votedItemIndex = status.get('voted_num');

        itemsContent =(
          <div className='enquete-vote-items'>
            {enqueteStatus.get('items').filter(item => item != '').map((item, index) => {
              const itemClassName = 'enquete-button disable' + ((votedItemIndex == index) ? '__voted' : '') + ' item-' + (index == enqueteStatus.get('items').length - 1 ? 'thinking' : index);
              const itemHTML = { __html: emojify(item) };
              return (<button key={index} className={itemClassName} dangerouslySetInnerHTML={itemHTML} />);
            })}
            {timeCountGaugeContent}
          </div>);

      } else {
        itemsContent =(
          <div className='enquete-vote-items'>
            {enqueteStatus.get('items').filter(item => item != '').map((item, index) => {
              const itemClassName = 'enquete-button active' + ' item-' + (index == enqueteStatus.get('items').length - 1 ? 'thinking' : index);
              const itemHTML = { __html: emojify(item) };
              return (<button key={index} className={itemClassName} dangerouslySetInnerHTML={itemHTML} onClick={this.handleEnqueteButtonClick} data-number={index} />);
            })}
            {timeCountGaugeContent}
          </div>);
      }

    } else if (enqueteStatus.get('type') === 'enquete_result') {
      itemsContent =(
        <div className='enquete-result-items'>
          {enqueteStatus.get('items').filter(item => item != '').map((item, index) => {
            // ratios is not immutable component
            const itemRatio = (enqueteStatus.get('ratios'))[index] + '%';
            const itemRatioText = enqueteStatus.get('ratios_text')[index];
            const itemRatioHTML = { __html: emojify(itemRatioText) };
            const itemHTML = { __html: emojify(item) };
            const resultGaugeClassName = 'item-gauge__inner item-' + (index == enqueteStatus.get('items').length - 1 ? 'thinking' : index);
            return (
              <div className='enquete-result-item-gauge'>
                <div className='item-gauge__content'>
                  <div className='item-gauge__text__wrapper'>
                    <span className='item-gauge__text' dangerouslySetInnerHTML={itemHTML} />
                  </div>
                  <div className='item-gauge__ratio__wrapper'>
                    <span className='item-gauge__ratio' dangerouslySetInnerHTML={itemRatioHTML} />
                  </div>
                </div>
                <div className='item-gauge__outer' style={{ width: '100%' }} />
                <div className={resultGaugeClassName} style={{ width: itemRatio }} />
              </div>);
          })}
        </div>);
    }
    return (
      <div className='enquete-form'>
        <div className='enquete-question' dangerouslySetInnerHTML={questionContent} />
        { itemsContent }
      </div>
    );
  }

}
