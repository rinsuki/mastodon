require 'rake'
require 'airbrake'

Airbrake.configure do |config|
  config.project_key = ENV['ERRBIT_PROJECT_KEY']
  config.project_id = ENV['ERRBIT_PROJECT_ID']
  config.host    = ENV['ERRBIT_HOST']
  config.environment = Rails.env
  config.ignore_environments = %w(development test)
end
