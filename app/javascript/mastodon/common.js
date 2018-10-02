import Rails from 'rails-ujs';

export function start() {
  require('font-awesome/css/font-awesome.css');
  require('react-select/dist/react-select.css');
  require.context('../images/', true);

  Rails.start();
};
