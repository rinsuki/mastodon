class NicovideoRankingService
  class NicovideoMaintenanceError < RuntimeError ; end

  def call(id, force = false)
    Rails.cache.fetch(key(id), force: force, expires_in: 24.hours) do
      fetch(id)
    end
  end

  protected

  def key(id)
    "niconico:video:ranking:#{id}"
  end

  def fetch(id)
    url = "http://www.nicovideo.jp/ranking/fav/hourly/#{id}?rss=2.0&lang=ja-jp"
    response = Request.new(:get, url).perform do |res|
      raise NicovideoMaintenanceError if res.code === 503
      res.body_with_limit
    end

    hash_items =  Hash.from_xml(response)
    return nil if hash_items.nil?

    process(hash_items)
  end

  def process(hash)
    hash['rss']['channel']['item'].map do |item|
      {}.tap do |ret|
        ret[:url] = item['link']
        Nokogiri::HTML(item['description']).tap do |desc|
          ret[:content_id] = ret[:url].match(/\/(\w+\d+)\z/)[1]
          id = ret[:content_id].match(/(\d+)\z/)[1]

          desc.css('.nico-thumbnail img').tap do |link|
            ret[:title] = link.attr('alt').value
            ret[:thumbnail] = link.attr('src').value.gsub(/\Ahttp:/,'https:')
          end

          desc.css('.nico-info-date').tap do |date|
            ret[:published] = date.text.gsub('：', ':')
          end
        end
      end
    end
  end
end
