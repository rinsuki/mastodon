require 'rails_helper'

RSpec.describe Settings::HighlightKeywordsController, type: :controller do
  render_views
  let(:user)  { Fabricate(:user, account: Fabricate(:account, username: 'alice')) }
  let(:token) { double acceptable?: true, resource_owner_id: user.id }
  let!(:highlight_keyword) { Fabricate(:highlight_keyword, account: user.account) }

  before do
    sign_in user, scope: :user
  end

  describe 'GET #index' do
    it 'returns http success' do
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST #create' do
    context 'when user creates highlight keyword' do
      it 'creates highlight keyword' do
        expect{
          post :create, params: { highlight_keyword: { word: 'test' } }
        }.to change(HighlightKeyword, :count).by(1)
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'when user destroies highlight keyword' do
      it 'destroies highlight keyword' do
        expect{
          delete :destroy, params: { id: highlight_keyword.id }
        }.to change(HighlightKeyword, :count).by(-1)
      end

      it 'redirects to settings_highlight_keywords_path' do
        delete :destroy, params: { id: highlight_keyword.id }
        expect(response).to redirect_to settings_highlight_keywords_path
      end
    end
  end
end
