require 'rails_helper'

RSpec.describe NicovideoRankingService do
  let(:service) { described_class.new }

  describe 'fetch' do
    it do
      stub_request(:get, 'http://www.nicovideo.jp/ranking/fav/hourly/all?lang=ja-jp&rss=2.0').
        to_return(status: 200, body: friends_fixture('ranking.xml'), headers: {})

      fetched = service.send(:fetch, 'all')
      expect(fetched.length).to eq 100
      item = fetched.first
      expect(item[:title]).to eq 'うんち提案レグくん.HelloAbyss'
      expect(item[:content_id]).to eq 'sm31891153'
      expect(item[:url]).to eq 'http://www.nicovideo.jp/watch/sm31891153'
      expect(item[:thumbnail]).to eq 'https://tn.smilevideo.jp/smile?i=31891153'
      expect(item[:published]).to eq '2017年09月09日 02:00:00'
    end
  end
end
