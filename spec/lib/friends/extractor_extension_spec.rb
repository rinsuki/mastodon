require 'rails_helper'

describe Friends::ExtractorExtension do
  describe '.extract_entities_with_indices' do
    before { Fabricate(:account, username: 'sm10') }
    let(:text) { '@sm10 http://www.nicovideo.jp/watch/sm9 nico.ms/lv114514 im101010 http://google.com/sm11 #sm18 sm9#1:30' }
    subject { Extractor.extract_entities_with_indices(text) }

    { niconico_link: 4, hashtag: 1, screen_name: 1 }.each do |type, count|
      describe type do
        it { expect(subject.select {|x| x[type] }.count).to eq count }
      end
    end
  end
end
