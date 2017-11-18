#frozen_string_literal: true

class Api::V1::NicovideoRankingsController < Api::BaseController

  rescue_from NicovideoRankingService::NicovideoMaintenanceError do
    render json: { error: 'niconico is under maintenance.' }, status: 503
  end

  def show
    @ranking = NicovideoRankingService.new.call(params[:id])
    render json: @ranking.to_json
  end
end
