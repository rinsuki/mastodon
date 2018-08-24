# == Schema Information
#
# Table name: highlight_keywords
#
#  id         :bigint(8)        not null, primary key
#  account_id :bigint(8)        not null
#  word       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class HighlightKeyword < ApplicationRecord
  belongs_to :account, required: true
  validates :account_id, :uniqueness => { :scope => :word }
  validates :word, presence: true, length: { maximum: 500 }
end
