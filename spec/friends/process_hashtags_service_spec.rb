# coding: utf-8
require 'rails_helper'

describe Friends::ProcessHashtagsService do
  let(:account) { Fabricate(:account, username: 'alice') }
  let(:status)  { Fabricate(:status, account: account, text: text) }
  let(:service) { ProcessHashtagsService.new }

  subject { service.call(status) }

  describe 'single' do
    let(:text) { 'sm9' }
    it do
      subject
      expect(status.tags.map(&:name)).to include 'ニコニコ動画タイムライン'
    end
  end

  describe 'double' do
    let(:text) { 'sm9 sm9' }
    it do
      expect { subject }.to change { Tag.count }.by(1)
      expect(status.tags.map(&:name)).to include 'ニコニコ動画タイムライン'
    end
  end

  describe 'multi' do
    let(:text) { 'sm9 lv1' }
    it do
      subject
      status.tags.map(&:name).tap do |tags|
        expect(tags).to include 'ニコニコ動画タイムライン'
        expect(tags).to include 'ニコニコ生放送タイムライン'
      end
    end
  end

  describe 'with string' do
    let(:text) { 'sm9 #ニコニコ動画タイムライン' }
    it do
      expect { subject }.to change { Tag.count }.by(1)
    end
  end

  describe 'remote status' do
    let(:account) { Fabricate(:account, domain: 'test.com') }
    let(:status) { Fabricate(:status, account: account, uri: 'a', text: text) }
    let(:text) { 'sm9' }

    it do
      expect { subject }.not_to change { Tag.count }
    end
  end
end
