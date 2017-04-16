import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';

const AccountButton = React.createClass({

  propTypes: {
    account: ImmutablePropTypes.map.isRequired
  },

  mixins: [PureRenderMixin],

  render() {
    const { account } = this.props;

    if (!account) {
      return null;
    }

    const nicoUrl = account.get('nico_url');

    if (nicoUrl === null) {
      return null;
    }

    return (
      <div className="nico-account-button">
        <a
          href={nicoUrl}
          target="_blank"
          rel="noopener"
        >
          <i className="nico-account-button__icon" />
        </a>
      </div>
    );
  }
});

export default AccountButton;
