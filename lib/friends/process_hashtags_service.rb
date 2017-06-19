module Friends
  module ProcessHashtagsService
    extend ActiveSupport::Concern

    def call(status, tags = [])
      super(status, tags)

      nicolinks = Extractor.extract_niconico_links_with_indices(status.text)
      tags = nicolinks.reduce([]) do |res, link|
        res << case link[:niconico_link]
               when NicoLink::VIDEO_RE
                 'smlink'
               when NicoLink::LIVE_RE
                 'lvlink'
               end
      end
      (tags.uniq - status.tags.map(&:name)).each do |tag|
        status.tags << Tag.where(name: tag).first_or_initialize(name: tag)
      end
    end
  end
end

::ProcessHashtagsService.prepend(Friends::ProcessHashtagsService)
