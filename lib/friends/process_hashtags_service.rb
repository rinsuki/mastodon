module Friends
  module ProcessHashtagsService
    extend ActiveSupport::Concern

    def call(status, tags = [])
      super(status, tags)
      nicolinks = Extractor.extract_niconico_links_with_indices(status.text)
      nicolinks.each do |link|
        case link[:niconico_link]
        when NicoLink::VIDEO_RE
          status.tags << Tag.where(name: 'smlink').first_or_initialize(name: 'smlink')
        when NicoLink::LIVE_RE
          status.tags << Tag.where(name: 'lvlink').first_or_initialize(name: 'lvlink')
        end
      end
    end
  end
end

::ProcessHashtagsService.prepend(Friends::ProcessHashtagsService)
