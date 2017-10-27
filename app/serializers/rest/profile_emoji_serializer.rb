class REST::ProfileEmojiSerializer < ActiveModel::Serializer
  include RoutingHelper

  attributes :shortcode, :account_id, :url, :account_url

  def account_id
    object.account.id
  end

  def url
    full_asset_url(object.image.url(:static))
  end

  def account_url
    short_account_url(object.account)
  end
end
