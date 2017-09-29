class Api::V1::HighlightKeywordsController < Api::BaseController
  before_action -> { doorkeeper_authorize! :read }
  before_action :require_user!

  respond_to :json

  def index
    @highlight_keywords = current_account.highlight_keywords
    render json: @highlight_keywords, each_serializer: REST::HighlightKeywordSerializer
  end
end
