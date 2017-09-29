class Settings::HighlightKeywordsController < ApplicationController
  layout 'admin'
  before_action :authenticate_user!
  before_action :set_highlight_keyword, only: [:destroy]
  before_action :set_highlight_keywords, only: [:index, :create]

  def index
    @highlight_keyword = HighlightKeyword.new
  end

  def create
    @highlight_keyword = HighlightKeyword.new(highlight_keyword_params.merge(account: current_account))

    if @highlight_keyword.save
      redirect_to settings_highlight_keywords_path, notice: I18n.t('generic.changes_saved_msg')
    else
      render :index
    end
  end

  def destroy
    @highlight_keyword.destroy
    redirect_to settings_highlight_keywords_path
  end

  private

  def highlight_keyword_params
    params.require(:highlight_keyword).permit(:word)
  end

  def set_highlight_keywords
    @highlight_keywords = current_account.highlight_keywords
  end

  def set_highlight_keyword
    @highlight_keyword = current_account.highlight_keywords.find(params[:id])
  end
end
