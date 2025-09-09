# Redmine Block User Plugin
# Plugin to block/delete users from specific tickets via comment actions

Redmine::Plugin.register :redmine_block_user do
  name 'Redmine Block User Plugin'
  author 'Leander Kretschmer'
  description 'Allows blocking/deleting users from specific tickets via comment actions'
  version '1.0.0'
  url 'https://github.com/leanderkretschmer/redmine_block_user'
  author_url 'https://github.com/leanderkretschmer'

  # Plugin settings
  settings default: {
    'blocked_ticket_ids' => ''
  }, partial: 'settings/redmine_block_user_settings'

  # No special permissions required - any logged-in user can delete users from configured tickets

  # Add menu item to administration menu
  menu :admin_menu, :redmine_block_user, 
       { controller: 'settings', action: 'plugin', id: 'redmine_block_user' }, 
       caption: 'Block User Settings'
end

# Load hooks and patches
Rails.application.config.to_prepare do
  require_dependency 'redmine_block_user/hooks/view_hooks'
  require_dependency 'redmine_block_user/patches/issues_controller_patch'
end