import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import SettingText from '../../../components/setting_text';
import SettingToggle from '../../notifications/components/setting_toggle';

const messages = defineMessages({
  filter_regex: { id: 'home.column_settings.filter_regex', defaultMessage: 'Filter out by regular expressions' },
  settings: { id: 'home.settings', defaultMessage: 'Column settings' },
});

@injectIntl
export default class ColumnSettings extends React.PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    highlight_keywords: ImmutablePropTypes.map.isRequired,
    columnId: PropTypes.string,
  };

  render () {
    const { settings, onChange, intl, highlight_keywords } = this.props;

    return (
      <div>

        <div className='column-settings__section'>
          <span><FormattedMessage id='home.column_settings.highlight_keywords' defaultMessage='Highlight Keywords' /></span>
          <a href='/settings/highlight_keywords' className='setting-highlight_keyword__icon'>
            <i className='fa fa-gear' />
          </a>
        </div>
        <div className='column-settings__row setting-highlight_keyword__body'>
          {highlight_keywords.get('keywords').map(keyword => {
            return <span key={keyword.get('id')} className='setting-highlight_keyword__section'>{keyword.get('word')}</span>;
          })}
        </div>
        <div className='column-settings__row'>
          <SettingToggle settings={settings} settingPath={['other', 'onlyMedia']} onChange={onChange} label={<FormattedMessage id='community.column_settings.media_only' defaultMessage='Media Only' />} />
        </div>

        <span className='column-settings__section'><FormattedMessage id='home.column_settings.advanced' defaultMessage='Advanced' /></span>

        <div className='column-settings__row'>
          <SettingText settings={settings} settingKey={['regex', 'body']} onChange={onChange} label={intl.formatMessage(messages.filter_regex)} />
        </div>
      </div>
    );
  }

}
