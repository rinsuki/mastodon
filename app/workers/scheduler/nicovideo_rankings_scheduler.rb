# frozen_string_literal: true

require 'sidekiq-scheduler'

class Scheduler::NicovideoRankingsScheduler
  include Sidekiq::Worker

  def perform
    return if Rails.env.development?

    logger.info 'Update niconico ranking cache'
    tags = %w(all game sing anime vocaloid music ent jikkyo radio sport science cooking g_politics animal history nature lecture play dance draw tech imas toho are diary other nicoindies travel drive handcraft make)
    tags.map { |tag|
      begin
        value = FetchNicoRankingService.new.call(tag)
        Rails.cache.write(tag, value, expire_in: 24.hour)
      rescue => e
        puts(e.message)
      end
    }
  end
end
