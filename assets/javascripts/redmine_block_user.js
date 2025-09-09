$(document).ready(function() {
  // Handle delete user button click
  $(document).on('click', '.delete-user-btn', function(e) {
    e.preventDefault();
    
    var userId = $(this).data('user-id');
    var issueId = $(this).data('issue-id');
    var userName = $(this).data('user-name');
    
    // Confirm deletion
    var confirmMessage = $('#block-user-confirm-template').data('confirm-message') || 
                        'Are you sure you want to delete this user? This action cannot be undone.';
    confirmMessage = confirmMessage.replace('%{user}', userName);
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    // Show loading state
    var $btn = $(this);
    var originalText = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin"></i> Deleting...');
    $btn.prop('disabled', true);
    
    // Send AJAX request
    $.ajax({
      url: '/block_users/delete_user',
      type: 'POST',
      data: {
        user_id: userId,
        issue_id: issueId,
        authenticity_token: $('meta[name="csrf-token"]').attr('content')
      },
      success: function(response) {
        if (response.success) {
          // Show success message
          showFlashMessage('notice', response.message);
          
          // Remove the journal entry or reload page
          var $journal = $btn.closest('.journal');
          if ($journal.length) {
            $journal.fadeOut(500, function() {
              $(this).remove();
            });
          } else {
            // Fallback: reload page
            window.location.reload();
          }
        } else {
          showFlashMessage('error', response.message);
          // Restore button
          $btn.html(originalText);
          $btn.prop('disabled', false);
        }
      },
      error: function(xhr, status, error) {
        var errorMessage = 'An error occurred while deleting the user.';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMessage = xhr.responseJSON.message;
        }
        showFlashMessage('error', errorMessage);
        
        // Restore button
        $btn.html(originalText);
        $btn.prop('disabled', false);
      }
    });
  });
  
  // Handle dropdown toggle
  $(document).on('click', '.block-user-menu-btn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var $dropdown = $(this).next('.dropdown-menu');
    
    // Close other dropdowns
    $('.dropdown-menu').not($dropdown).hide();
    
    // Toggle current dropdown
    $dropdown.toggle();
  });
  
  // Close dropdown when clicking outside
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.block-user-actions').length) {
      $('.dropdown-menu').hide();
    }
  });
  
  // Prevent dropdown from closing when clicking inside
  $(document).on('click', '.dropdown-menu', function(e) {
    e.stopPropagation();
  });
});

// Function to show flash messages
function showFlashMessage(type, message) {
  // Remove existing flash messages
  $('#flash_notice, #flash_error').remove();
  
  // Create new flash message
  var flashClass = type === 'notice' ? 'flash notice' : 'flash error';
  var $flash = $('<div id="flash_' + type + '" class="' + flashClass + '">' + message + '</div>');
  
  // Insert at top of content
  $('#content').prepend($flash);
  
  // Auto-hide after 5 seconds
  setTimeout(function() {
    $flash.fadeOut(500, function() {
      $(this).remove();
    });
  }, 5000);
}