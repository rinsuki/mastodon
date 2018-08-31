# frozen_string_literal: true
# == Schema Information
#
# Table name: favourite_tags
#
#  id         :bigint(8)        not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  account_id :bigint(8)        not null
#  tag_id     :bigint(8)        not null
#

class FavouriteTag < ApplicationRecord
  belongs_to :account, required: true
  belongs_to :tag, required: true
  accepts_nested_attributes_for :tag

  validates :tag, uniqueness: { scope: :account }
end
