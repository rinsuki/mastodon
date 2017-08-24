import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import Collapsable from '../../../components/collapsable';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';

const messages = defineMessages({
  enquete_input_item_1: { id: 'enquete_input.item_1', defaultMessage: 'item1' },
  enquete_input_item_2: { id: 'enquete_input.item_2', defaultMessage: 'item2' },
  enquete_input_item_3: { id: 'enquete_input.item_3', defaultMessage: 'item3(option)' },
  enquete_input_item_4: { id: 'enquete_input.item_4', defaultMessage: 'item4(option)' },
});

@injectIntl
export default class EnqueteInputs extends ImmutablePureComponent {

  static propTypes = {
    enquete: PropTypes.bool.isRequired,
    enquete_items: ImmutablePropTypes.list.isRequired,
    intl: PropTypes.object.isRequired,
    onChangeEnqueteText: PropTypes.func.isRequired,
  };
  handleChangeEnqueteText = (e) => {
    const enquete_item_index = e.target.getAttribute('Id').split('-')[2];
    this.props.onChangeEnqueteText(e.target.value, enquete_item_index);
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.props.onSubmit();
    }
  }

  render(){
    const { intl } = this.props;
    const inputMaxLength = 15;
    return (
      <Collapsable isVisible={this.props.enquete} fullHeight={158}>
        <div className='enquete-input'>
          <input placeholder={intl.formatMessage(messages.enquete_input_item_1)} value={this.props.enquete_items.get(0)} onChange={this.handleChangeEnqueteText} onKeyDown={this.handleKeyDown} type='text' className='enquete-input__input'  id='enquete-input-0' maxLength={inputMaxLength} />
        </div>
        <div className='enquete-input'>
          <input placeholder={intl.formatMessage(messages.enquete_input_item_2)} value={this.props.enquete_items.get(1)} onChange={this.handleChangeEnqueteText} onKeyDown={this.handleKeyDown} type='text' className='enquete-input__input'  id='enquete-input-1' maxLength={inputMaxLength} />
        </div>
        <div className='enquete-input'>
          <input placeholder={intl.formatMessage(messages.enquete_input_item_3)} value={this.props.enquete_items.get(2)} onChange={this.handleChangeEnqueteText} onKeyDown={this.handleKeyDown} type='text' className='enquete-input__input'  id='enquete-input-2' maxLength={inputMaxLength} />
        </div>
        <div className='enquete-input'>
          <input placeholder={intl.formatMessage(messages.enquete_input_item_4)} value={this.props.enquete_items.get(3)} onChange={this.handleChangeEnqueteText} onKeyDown={this.handleKeyDown} type='text' className='enquete-input__input'  id='enquete-input-3' maxLength={inputMaxLength} />
        </div>
      </Collapsable>);
  }

}
