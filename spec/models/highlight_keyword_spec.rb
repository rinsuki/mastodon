require 'rails_helper'

RSpec.describe HighlightKeyword, type: :model do
  describe 'validation' do
    let(:account) { Fabricate :account }
    context 'when highlight keywords are created' do
      it 'invalidate same word and account id' do
        2.times{ HighlightKeyword.create(word: 'keyword', account: account) }
        expect(HighlightKeyword.count).to eq 1
      end

      it 'validate japanese' do
        expect(HighlightKeyword.create(word: "ひらがな", account: account)).to be_valid
        expect(HighlightKeyword.create(word: "カタカナ", account: account)).to be_valid
        expect(HighlightKeyword.create(word: "漢字", account: account)).to be_valid
      end

      it 'invalidate empty word' do
        expect(HighlightKeyword.create(word: "", account: account)).not_to be_valid
      end

      it 'invalidate empty account id' do
        expect(HighlightKeyword.create(word: 'keyword')).not_to be_valid
      end
    end
  end

  describe 'deletion' do
    let(:account) { Fabricate :account}
    context 'when an account is deleted' do
      it 'highlight keywords is deleted with account' do
        highlight_keyword = HighlightKeyword.create(word: 'keyword', account: account)
        expect { highlight_keyword.account.destroy }.to change { HighlightKeyword.count }.by(-1)
      end
    end
  end
end
