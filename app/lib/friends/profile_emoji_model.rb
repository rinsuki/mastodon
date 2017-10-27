# frozen_string_literal: true

module Friends
  module ProfileEmojiModel
    extend ActiveSupport::Concern

    IMAGE_MIME_TYPES = AccountAvatar::IMAGE_MIME_TYPES

    Image = Struct.new(:source) do
      def url(type = :original)
        type = :original unless source.content_type == 'image/gif'
        source.url(type)
      end
    end

    def profile_emoji
      avatar
    end

    def profile_emoji_original_url
      avatar_original_url
    end

    def profile_emoji_static_url
      avatar_static_url
    end
  end
end
