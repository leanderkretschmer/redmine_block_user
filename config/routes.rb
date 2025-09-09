# Plugin routes
RedmineApp::Application.routes.draw do
  post 'block_users/delete_user', to: 'block_users#delete_user'
  get 'block_users/search_tickets', to: 'block_users#search_tickets'
end