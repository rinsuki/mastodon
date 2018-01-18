# frozen_string_literal: true

class REST::FavouriteTagSerializer < ActiveModel::Serializer
  attributes :id, :name

  def id
    object.id.to_s
  end

  def name
    object.tag.name
  end
end
