$(document).ready(function() {
  // Event-Handler für Benutzer löschen (direkter Button in Aktionsleiste)
  $(document).on('click', '.delete-user-link', function(e) {
    e.preventDefault();
    
    var userId = $(this).data('user-id');
    var userName = $(this).data('user-name');
    
    if (confirm('Sind Sie sicher, dass Sie den Benutzer "' + userName + '" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      $.ajax({
        url: '/block_users/delete_user',
        type: 'POST',
        data: {
          user_id: userId,
          authenticity_token: $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
          if (response.success) {
            alert('Benutzer erfolgreich gelöscht.');
            // Seite neu laden, um die Änderungen zu zeigen
            location.reload();
          } else {
            alert('Fehler: ' + response.message);
          }
        },
        error: function() {
          alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
      });
    }
  });
  
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
  
  // Ticket-Suche mit Autocomplete
  var searchTimeout;
  var currentResults = [];
  
  $('#ticket_search_input').on('input', function() {
    var query = $(this).val().trim();
    var resultsDiv = $('#search_results');
    
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
      resultsDiv.hide().empty();
      return;
    }
    
    searchTimeout = setTimeout(function() {
      $.ajax({
        url: '/block_users/search_tickets',
        type: 'GET',
        data: { q: query },
        success: function(tickets) {
          currentResults = tickets;
          displaySearchResults(tickets);
        },
        error: function() {
          resultsDiv.hide().empty();
        }
      });
    }, 300);
  });
  
  function displaySearchResults(tickets) {
    var resultsDiv = $('#search_results');
    resultsDiv.empty();
    
    if (tickets.length === 0) {
      resultsDiv.html('<div class="search-result-item no-results">Keine Tickets gefunden</div>');
      resultsDiv.show();
      return;
    }
    
    tickets.forEach(function(ticket) {
      var item = $('<div class="search-result-item" data-ticket-id="' + ticket.id + '">' + 
                   ticket.display + '</div>');
      resultsDiv.append(item);
    });
    
    resultsDiv.show();
  }
  
  // Ticket aus Suchergebnissen auswählen
  $(document).on('click', '.search-result-item', function() {
    var ticketId = $(this).data('ticket-id');
    if (ticketId) {
      addTicketToList(ticketId);
      $('#ticket_search_input').val('');
      $('#search_results').hide().empty();
    }
  });
  
  // Ticket über Button hinzufügen
  $('#add_ticket_btn').on('click', function() {
    var query = $('#ticket_search_input').val().trim();
    
    // Prüfe ob es eine direkte ID ist
    if (/^\d+$/.test(query)) {
      addTicketToList(parseInt(query));
      $('#ticket_search_input').val('');
      $('#search_results').hide().empty();
    } else if (currentResults.length === 1) {
      // Wenn nur ein Suchergebnis vorhanden ist, füge es hinzu
      addTicketToList(currentResults[0].id);
      $('#ticket_search_input').val('');
      $('#search_results').hide().empty();
    } else {
      alert('Bitte wählen Sie ein Ticket aus den Suchergebnissen aus oder geben Sie eine gültige Ticket-ID ein.');
    }
  });
  
  function addTicketToList(ticketId) {
    var textarea = $('#blocked_ticket_ids_textarea');
    var currentIds = textarea.val().split('\n').map(function(id) {
      return id.trim();
    }).filter(function(id) {
      return id !== '';
    });
    
    var ticketIdStr = ticketId.toString();
    
    if (currentIds.indexOf(ticketIdStr) === -1) {
      currentIds.push(ticketIdStr);
      textarea.val(currentIds.join('\n'));
    } else {
      alert('Ticket bereits hinzugefügt');
    }
  }
  
  // Suchergebnisse ausblenden wenn außerhalb geklickt wird
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.ticket-search-section').length) {
      $('#search_results').hide();
    }
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