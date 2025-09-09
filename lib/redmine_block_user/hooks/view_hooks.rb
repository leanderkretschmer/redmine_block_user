module RedmineBlockUser
  module Hooks
    class ViewHooks < Redmine::Hook::ViewListener
      
      # Hook to add the delete user button directly to journal actions bar
      def view_issues_history_journal_bottom(context = {})
        journal = context[:journal]
        issue = context[:issue]
        
        return '' unless journal && issue && journal.user
        
        # Check if current issue is in blocked ticket IDs
        blocked_ticket_ids = get_blocked_ticket_ids
        return '' unless blocked_ticket_ids.include?(issue.id)
        
        # No permission check - any logged-in user who can view the ticket can see the button
        
        # Don't show for admin users or current user
        return '' if journal.user.admin? || journal.user == User.current
        
        # Add JavaScript to inject button into journal actions
        javascript_tag = <<~JS
          <script>
            $(document).ready(function() {
              var journalId = #{journal.id};
              var userId = #{journal.user.id};
              var userName = '#{escape_javascript(journal.user.name)}';
              
              // Find the journal actions div for this specific journal
              var journalDiv = $('#change-#{journal.id}');
              var actionsDiv = journalDiv.find('.journal-actions, .contextual');
              
              if (actionsDiv.length > 0) {
                // Create delete button
                var deleteBtn = $('<a href="#" class="icon icon-del delete-user-link" data-user-id="' + userId + '" data-user-name="' + userName + '" title="Benutzer löschen">Benutzer löschen</a>');
                
                // Add button to actions
                actionsDiv.append(' | ').append(deleteBtn);
              }
            });
          </script>
        JS
        
        javascript_tag.html_safe
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