# coding: utf-8
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe NicoLink, type: :model do

  describe 'NICO_DOMAIN_RE' do
    let(:regex) { /\A#{NicoLink::NICO_DOMAIN_RE}\z/ }

    %w(nicovideo.jp/
       nicovideo.jp/watch/
       www.nicovideo.jp/
       www.nicovideo.jp/watch/
       live2.nicovideo.jp/
       nico.ms/
       dic.nicovideo.jp/).each do |text|
      context text do
        it { expect(text).to match regex }
      end
    end

    %w(example.com/
       nico.ms/watch/
       example.nico.ms/
       nicovideo.example.com/).each do |text|
      context text do
        it { expect(text).not_to match regex }
      end
    end
  end

  describe 'NICOLINK_RE' do
    let(:regex) { NicoLink::NICOLINK_RE }
    let(:text) { self.class.metadata[:description] }
    subject { text }

    describe 'im9#11:10' do
      it { is_expected.to match regex }
    end
    describe 'im0009#11:10' do
      it { is_expected.to match regex }
    end

    context 'with time' do
      it 'matches nicolinks' do
        expect('lv9#11:10').to match regex
        expect('lv0009#11:10').to match regex

        expect('sm9#11:10').to match regex
        expect('sm0009#11:10').to match regex
      end

      it 'matches nicolinks within Japanese text' do
        %w(このim9#11:10が好き つim90923#11:10は観たこと無いな あim9#11:10９ このlv9#11:10が好き つlv90923#11:10は観たこと無いな あlv9#11:10９ このsm9#11:10が好き つsm90923#11:10は観たこと無いな あsm9#11:10９).each do |text|
          expect(text).to match regex
        end
      end
    end

    context 'with params' do
      subject { NicoLink.parse 'http://nico.ms/sm9?tw=twitter&time=90' }
      it { expect(subject.from_sec).to eq 90 }
      it { expect(subject.time).to eq '1:30' }
    end

    context 'without time' do
      %w(im9 im0009 lv9 lv0009 sm9 sm0009).each do |text|
        describe text do
          it { is_expected.to match regex }
        end
      end

      it 'matches nicolinks within Japanese text' do
        expect('このim9が好き').to match regex
        expect('つim90923は観たこと無いな').to match regex
        expect('あim9９').to match regex

        expect('このlv9が好き').to match regex
        expect('つlv90923は観たこと無いな').to match regex
        expect('あlv9９').to match regex

        expect('このsm9が好き').to match regex
        expect('つsm90923は観たこと無いな').to match regex
        expect('あsm9９').to match regex
      end
      describe 'mylist/1' do
        it { is_expected.to match regex }
      end
      describe 'nicovideo.jp/mylist/1' do
        it { is_expected.to match regex }
      end

      describe 'dic.nicovideo.jp/a/%E5%91%89%E7%B9%94%E3%81%82%E3%81%8E%E3%82%8A' do
        it { is_expected.to match NicoLink::NICODIC_LINK_RE }
        it { is_expected.to match NicoLink::NICOLINK_RE }
      end

      describe 'dic.nicovideo.jp/a/呉織あぎり' do
        it { is_expected.to match NicoLink::NICODIC_LINK_RE }
        it { is_expected.to match NicoLink::NICOLINK_RE }
      end
    end

    describe 'enabled prefixs' do
      context 'このsm9' do
        it { is_expected.to match regex }
      end
      context '#sm9' do
        it { is_expected.to match regex }
      end
      context ' nicovideo.jp/watch/sm9?hello=world' do
        it { is_expected.to match regex }
      end
      context 'nico.ms/sm9' do
        it { is_expected.to match regex }
      end

      context 'https://example.com/sm9' do
        it { is_expected.not_to match regex }
      end
      context 'https://example.com/Aha_(hello)sm9' do
        it { is_expected.not_to match regex }
      end
      context 'https://example.com/hellosm9' do
        it { is_expected.not_to match regex }
      end
      context 'https://sm9.example.com/hellosm9' do
        it { is_expected.not_to match regex }
      end
    end

    describe 'url matching' do
      subject { regex.match(text)[:nico_domain] }
      describe 'このsm9' do
        it { is_expected.to eq nil }
      end
      describe 'このnico.ms/sm9' do
        it { is_expected.to eq 'nico.ms/' }
      end
      describe 'このhttps://nico.ms/sm9' do
        it { is_expected.to eq 'https://nico.ms/' }
      end
      describe 'このnico.ms/mylist/1' do
        it { is_expected.to eq 'nico.ms/' }
      end
    end
  end

  describe '#video?' do
    subject { NicoLink.new(nico_id: text, time: nil) }

    context 'sm9' do
      let(:text) { 'sm9' }
      it { is_expected.to be_video }
    end

    context 'im9' do
      let(:text) { 'im9' }
      it { is_expected.not_to be_video }
    end
  end

  describe '#text' do
    subject { NicoLink.new(nico_id: 'sm9', time: '1:30') }
    it { expect(subject.text).to eq 'sm9#1:30' }
  end

  describe '#url' do
    context 'with valid time' do
      subject do
        {
          '0:01': 1,
          '0:02': 2,
          '0:10': 10,
          '00:01': 1,
          '00:02': 2,
          '00:10': 10,
          '2:59': 179,
          '02:59': 179,
          '99:59': 5999,
        }
      end

      it 'does not add from param for non-temporal ids' do
        subject.each do |time, _|
          expect(NicoLink.new(nico_id: 'im0139401923849', time: time).url).to eq 'https://nico.ms/im0139401923849'
        end
      end

      it 'adds from param for temporal ids' do
        subject.each do |time, val|
          expect(NicoLink.new(nico_id: 'lv84120982743', time: time).url).to eq "https://nico.ms/lv84120982743?from=#{val}"
          expect(NicoLink.new(nico_id: 'sm9', time: time).url).to eq "https://nico.ms/sm9?from=#{val}"
        end
      end
    end

    context 'with invalid time' do
      subject do
        %w[
          0:1
          00:00
          999
          9:60
          000099:59
          99:599
          999:59
        ]
      end

      it 'does not add from param for non-temporal ids' do
        subject.each do |time|
          expect(NicoLink.new(nico_id: 'im0', time: time).url).to eq 'https://nico.ms/im0'
        end
      end

      it 'does not add from param for temporal ids' do
        subject.each do |time|
          expect(NicoLink.new(nico_id: 'sm9', time: time).url).to eq 'https://nico.ms/sm9'
        end
      end
    end

    context 'without time' do
      let(:im) { NicoLink.new(nico_id: 'im0139401923849') }
      let(:lv) { NicoLink.new(nico_id: 'lv84120982743') }
      let(:sm) { NicoLink.new(nico_id: 'sm9') }

      it 'returns a proper href' do
        expect(im.url).to eq 'https://nico.ms/im0139401923849'
        expect(lv.url).to eq 'https://nico.ms/lv84120982743'
        expect(sm.url).to eq 'https://nico.ms/sm9'
      end
    end
  end

  describe '#range' do
    subject { NicoLink.parse(text).range }

    context 'with domain' do
      let(:text) { 'test https://nico.ms/sm9?tw=tw#1:30 text' }
      it { is_expected.to eq [5, text.length - 5] }
    end

    context 'without domain' do
      let(:text) { 'test sm9#1:30 test' }
      it { is_expected.to eq [5, text.length - 5] }
    end

    context 'nicodic' do
      let(:text) { 'test http://dic.nicovideo.jp/a/%E5%91%89%E7%B9%94%E3%81%82%E3%81%8E%E3%82%8A text' }
        it { is_expected.to eq [5, text.length - 5] }
    end
  end

  describe '.parse' do
    context 'without time' do
      subject do
        a = ['sm9', ' sm9', '　sm9', 'あsm9', 'sm9９', 'あsm9９',
             'lv9', ' lv9', '　lv9', 'あlv9', 'lv9９', 'あlv9９',
             'im9', ' im9', '　im9', 'あim9', 'im9９', 'あim9９']
        a.map { |s| NicoLink.parse s }
      end

      it 'returns proper NicoLink' do
        subject.each do |subj|
          expect(subj.is_a?(NicoLink)).to be_truthy
        end
      end
    end

    context 'dic' do
      let(:text) { 'http://dic.nicovideo.jp/a/%E5%91%89%E7%B9%94%E3%81%82%E3%81%8E%E3%82%8A' }
      subject { NicoLink.parse(text) }
      it { expect(subject.text).to eq "呉織あぎり\u2006:nicodic:" }
      it { expect(subject.url).to eq text }
    end
  end
end
