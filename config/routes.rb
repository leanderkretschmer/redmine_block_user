# Plugin routes
RedmineApp::Application.routes.draw do
  post 'block_users/delete_user', to: 'block_users#delete_user'
end