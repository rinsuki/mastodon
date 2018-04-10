require 'rails_helper'

RSpec.describe Friends::SuspendAccountExtension do
  let!(:account) { Fabricate(:account) }
  let!(:user) { Fabricate(:user, provider: :niconico, uid: 123, account: account) }

  it do
    expect { SuspendAccountService.new.call(account) }.to change { account.user.uid }.to(nil)
  end
end
