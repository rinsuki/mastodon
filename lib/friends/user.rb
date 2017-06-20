module Friends
  module User
    extend ActiveSupport::Concern

    def nico_url
      uid && !hide_oauth ? "http://www.nicovideo.jp/user/#{uid}" : nil
    end
  end
end

::User.include(Friends::User)
