class BlockUsersController < ApplicationController
  before_action :require_login
  before_action :find_user, only: [:delete_user]
  before_action :find_issue, only: [:delete_user]
  before_action :authorize_global, only: [:delete_user]

  def delete_user
    # Check if the current issue is in the configured blocked ticket IDs
    blocked_ticket_ids = get_blocked_ticket_ids
    
    unless blocked_ticket_ids.include?(@issue.id)
      render json: { 
        success: false, 
        message: l(:error_ticket_not_configured) 
      }, status: :forbidden
      return
    end

    # Check if user has permission to delete users
    unless User.current.allowed_to_globally?(:block_users_from_tickets)
      render json: { 
        success: false, 
        message: l(:error_permission_denied) 
      }, status: :forbidden
      return
    end

    # Prevent deletion of admin users or current user
    if @user.admin? || @user == User.current
      render json: { 
        success: false, 
        message: l(:error_cannot_delete_admin_or_self) 
      }, status: :unprocessable_entity
      return
    end

    begin
      # Delete the user
      if @user.destroy
        render json: { 
          success: true, 
          message: l(:notice_user_deleted) 
        }
      else
        render json: { 
          success: false, 
          message: l(:error_user_not_deleted) 
        }, status: :unprocessable_entity
      end
    rescue => e
      Rails.logger.error "Error deleting user #{@user.id}: #{e.message}"
      render json: { 
        success: false, 
        message: l(:error_user_not_deleted) 
      }, status: :internal_server_error
    end
  end

  private

  def find_user
    @user = User.find(params[:user_id])
  rescue ActiveRecord::RecordNotFound
    render json: { 
      success: false, 
      message: l(:error_user_not_found) 
    }, status: :not_found
  end

  def find_issue
    @issue = Issue.find(params[:issue_id])
  rescue ActiveRecord::RecordNotFound
    render json: { 
      success: false, 
      message: l(:error_issue_not_found) 
    }, status: :not_found
  end

  def get_blocked_ticket_ids
    setting_value = Setting.plugin_redmine_block_user['blocked_ticket_ids'] || ''
    setting_value.split(',').map(&:strip).map(&:to_i).reject(&:zero?)
  end
end