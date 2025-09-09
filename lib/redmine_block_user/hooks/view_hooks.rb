module RedmineBlockUser
  module Hooks
    class ViewHooks < Redmine::Hook::ViewListener
      
      # Hook to add the delete user button to journal entries (comments)
      def view_issues_history_journal_bottom(context = {})
        journal = context[:journal]
        issue = context[:issue]
        
        return '' unless journal && issue && journal.user
        
        # Check if current issue is in blocked ticket IDs
        blocked_ticket_ids = get_blocked_ticket_ids
        return '' unless blocked_ticket_ids.include?(issue.id)
        
        # Check if user has permission
        return '' unless User.current.allowed_to_globally?(:block_users_from_tickets)
        
        # Don't show for admin users or current user
        return '' if journal.user.admin? || journal.user == User.current
        
        context[:controller].send(:render_to_string, {
          partial: 'block_users/journal_actions',
          locals: {
            journal: journal,
            issue: issue,
            user: journal.user
          }
        })
      end
      
      # Hook to add JavaScript and CSS
      def view_layouts_base_html_head(context = {})
        stylesheet_link_tag('redmine_block_user', plugin: 'redmine_block_user') +
        javascript_include_tag('redmine_block_user', plugin: 'redmine_block_user')
      end
      
      private
      
      def get_blocked_ticket_ids
        setting_value = Setting.plugin_redmine_block_user['blocked_ticket_ids'] || ''
        setting_value.split(',').map(&:strip).map(&:to_i).reject(&:zero?)
      end
    end
  end
end