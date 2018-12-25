require 'rails_helper'

RSpec.describe NicovideoRankingService do
  let(:service) { described_class.new }

  describe 'fetch' do
    it do
      stub_request(:get, 'http://www.nicovideo.jp/ranking/fav/hourly/all?lang=ja-jp&rss=2.0').
        to_return(status: 200, body: friends_fixture('ranking.xml'), headers: {})

      fetched = service.send(:fetch, 'all')
      expect(fetched.length).to eq 100
      item = fetched[1]
      expect(item[:title]).to eq '16歳清楚委員長、クリスマスに組曲『ニコニコ動画』を熱唱'
      expect(item[:content_id]).to eq 'sm34371431'
      expect(item[:url]).to eq 'http://www.nicovideo.jp/watch/sm34371431'
      expect(item[:thumbnail]).to eq 'https://tn.smilevideo.jp/smile?i=34371431.23991'
      expect(item[:published]).to eq '2018年12月25日 02:38:02'
    end
  end
end
