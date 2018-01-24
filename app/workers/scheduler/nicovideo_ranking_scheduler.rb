# frozen_string_literal: true

require 'sidekiq-scheduler'

class Scheduler::NicovideoRankingScheduler
  include Sidekiq::Worker

  def perform
    service = NicovideoRankingService.new

    logger.info 'Update niconico ranking cache'
    tags = %w(all game sing anime vocaloid music ent jikkyo radio sport science cooking g_politics animal history nature lecture play dance draw tech imas toho are diary other nicoindies travel drive handcraft make)

    ranking = tags.map {|tag| [tag, service.call(tag, true)]}.to_h
    Redis.current.publish('nicovideo:ranking:streaming', Oj.dump(event: 'update', payload: ranking))
  rescue => e
    puts(e.message)
  end
end
