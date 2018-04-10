module Friends
  module SuspendAccountExtension
    def call(account, **options)
      super
      account.user.update(provider: nil, uid: nil) if account.user && !account.user.destroyed?
    end
  end
end
