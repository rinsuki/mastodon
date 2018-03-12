unless ENV['DISABLE_PROJECT_ID'].present?

  require 'rake'
  require 'airbrake'

  IGNORE_EXCEPTIONS = %w(Mastodon::UnexpectedResponseError OpenSSL::SSL::SSLError)

  Airbrake.configure do |config|
    config.project_key = ENV['ERRBIT_PROJECT_KEY']
    config.project_id = ENV['ERRBIT_PROJECT_ID']
    config.host    = ENV['ERRBIT_HOST']
    config.environment = Rails.env
    config.ignore_environments = %w(development test)
  end

  Airbrake.add_filter(&:ignore!) unless ENV['ERRBIT_HOST']

  Airbrake.add_filter do |notice|
    if notice[:errors].any? { |error| IGNORE_EXCEPTIONS.include?(error[:type]) }
      notice.ignore!
    end
  end
end
