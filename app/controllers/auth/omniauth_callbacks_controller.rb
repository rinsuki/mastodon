class Auth::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  Devise.omniauth_providers.each do |provider|
    define_method(provider) do
      auth = request.env['omniauth.auth']
      if current_user
        current_user.update(provider: auth.provider, uid: auth.uid)
      else
        @user = User.find_by(provider: auth.provider, uid: auth.uid)
        sign_in @user if @user
      end

      if current_user
        redirect_to root_path
      else
        redirect_to new_user_registration_path
      end
    end
  end
end
