module RedmineBlockUser
  module Patches
    module IssuesControllerPatch
      def self.included(base)
        base.class_eval do
          # Add helper method to check if issue allows user blocking
          helper_method :issue_allows_user_blocking?
        end
      end
      
      private
      
      def issue_allows_user_blocking?(issue)
        return false unless issue
        
        # Get blocked ticket IDs from settings
        blocked_ticket_ids = get_blocked_ticket_ids
        
        # Check if current issue is in the list
        blocked_ticket_ids.include?(issue.id)
      end
      
      def get_blocked_ticket_ids
        setting_value = Setting.plugin_redmine_block_user['blocked_ticket_ids'] || ''
        setting_value.split(',').map(&:strip).map(&:to_i).reject(&:zero?)
      end
    end
  end
end

# Apply the patch
Rails.application.config.to_prepare do
  unless IssuesController.included_modules.include?(RedmineBlockUser::Patches::IssuesControllerPatch)
    IssuesController.send(:include, RedmineBlockUser::Patches::IssuesControllerPatch)
  end
end