$(document).ready(function() {
  // Event handler for delete user button in action bar
  $(document).on('click', '.delete-user-link', function(e) {
    e.preventDefault();
    
    if (!confirm('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?')) {
      return;
    }
    
    var $link = $(this);
    var userId = $link.data('user-id');
    
    $.ajax({
      url: '/block_users/delete_user',
      type: 'POST',
      data: {
        user_id: userId,
        authenticity_token: $('meta[name="csrf-token"]').attr('content')
      },
      success: function(response) {
        if (response.success) {
          // Remove the journal entry from the DOM
          $link.closest('.journal').fadeOut(300, function() {
            $(this).remove();
          });
          
          // Show success message
          if (response.message) {
            $('<div class="flash notice">' + response.message + '</div>')
              .prependTo('#content')
              .delay(3000)
              .fadeOut();
          }
        } else {
          alert('Fehler: ' + (response.message || 'Unbekannter Fehler'));
        }
      },
      error: function(xhr, status, error) {
        alert('Fehler beim Löschen des Benutzers: ' + error);
      }
    });
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
  
  // Ticket search functionality
  var searchTimeout;
  var $searchInput = $('#ticket_search_input');
  var $searchResults = $('#search_results');
  var $addedTicketsList = $('#added_tickets_list');
  var $hiddenField = $('#blocked_ticket_ids_hidden');

  // Load existing tickets on page load
  loadExistingTickets();

  // Handle input in search field
  $searchInput.on('input', function() {
    var query = $(this).val().trim();
    
    clearTimeout(searchTimeout);
    
    if (query.length < 1) {
      $searchResults.hide().empty();
      return;
    }
    
    searchTimeout = setTimeout(function() {
      searchTickets(query);
    }, 300);
  });

  // Search for tickets by ID
  function searchTickets(query) {
    // Only search if query looks like a number (ticket ID)
    if (!/^\d+$/.test(query)) {
      $searchResults.html('<div class="search-result-item no-results">Bitte geben Sie eine Ticket-ID ein</div>').show();
      return;
    }

    $.ajax({
      url: '/block_users/search_tickets',
      type: 'GET',
      data: { q: query },
      success: function(response) {
        displaySearchResults(response.tickets || []);
      },
      error: function() {
        $searchResults.html('<div class="search-result-item error">Fehler bei der Suche</div>').show();
      }
    });
  }

  // Display search results
  function displaySearchResults(tickets) {
    $searchResults.empty();
    
    if (tickets.length === 0) {
      $searchResults.html('<div class="search-result-item no-results">Kein Ticket mit dieser ID gefunden</div>').show();
      return;
    }
    
    tickets.forEach(function(ticket) {
      var $item = $('<div class="search-result-item" data-ticket-id="' + ticket.id + '">' +
                   '<strong>#' + ticket.id + '</strong> - ' + ticket.subject +
                   '<button type="button" class="add-ticket-btn">Hinzufügen</button>' +
                   '</div>');
      
      $item.find('.add-ticket-btn').on('click', function(e) {
        e.stopPropagation();
        addTicket(ticket);
      });
      
      $searchResults.append($item);
    });
    
    $searchResults.show();
  }

  // Add ticket to the list
  function addTicket(ticket) {
    // Get current ticket IDs
    var currentIds = getCurrentTicketIds();
    
    // Check if ticket is already added
    if (currentIds.indexOf(ticket.id.toString()) !== -1) {
      alert('Dieses Ticket wurde bereits hinzugefügt.');
      return;
    }
    
    // Add ticket ID to the list
    currentIds.push(ticket.id.toString());
    updateTicketIds(currentIds);
    
    // Add ticket to visual list
    addTicketToList(ticket);
    
    // Clear search
    $searchInput.val('');
    $searchResults.hide();
  }

  // Add ticket to visual list
  function addTicketToList(ticket) {
    var $ticketItem = $('<div class="added-ticket-item" data-ticket-id="' + ticket.id + '">' +
                       '<span class="ticket-info">#' + ticket.id + ' - ' + ticket.subject + '</span>' +
                       '<button type="button" class="remove-ticket-btn">Entfernen</button>' +
                       '</div>');
    
    $ticketItem.find('.remove-ticket-btn').on('click', function() {
      removeTicket(ticket.id);
    });
    
    $addedTicketsList.append($ticketItem);
  }

  // Remove ticket from list
  function removeTicket(ticketId) {
    var currentIds = getCurrentTicketIds();
    var index = currentIds.indexOf(ticketId.toString());
    
    if (index > -1) {
      currentIds.splice(index, 1);
      updateTicketIds(currentIds);
    }
    
    $addedTicketsList.find('[data-ticket-id="' + ticketId + '"]').remove();
  }

  // Get current ticket IDs from hidden field
  function getCurrentTicketIds() {
    var value = $hiddenField.val() || '';
    return value.split(',').map(function(id) {
      return id.trim();
    }).filter(function(id) {
      return id !== '';
    });
  }

  // Update ticket IDs in hidden field
  function updateTicketIds(ids) {
    $hiddenField.val(ids.join(', '));
  }

  // Load existing tickets on page load
  function loadExistingTickets() {
    var currentIds = getCurrentTicketIds();
    
    currentIds.forEach(function(ticketId) {
      // Fetch ticket info and add to list
      $.ajax({
        url: '/block_users/search_tickets',
        type: 'GET',
        data: { q: ticketId },
        success: function(response) {
          if (response.tickets && response.tickets.length > 0) {
            var ticket = response.tickets[0];
            addTicketToList(ticket);
          }
        }
      });
    });
  }
  
  // Hide search results when clicking outside
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.ticket-search-section').length) {
      $searchResults.hide();
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