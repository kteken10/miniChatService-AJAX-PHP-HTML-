// Écouter l'événement de chargement de la page
window.addEventListener('load', function() {
    // Sélectionner le formulaire et écouter l'événement de soumission
    var messageForm = document.getElementById('messageForm');
    messageForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Empêcher le rechargement de la page
  
      // Récupérer les valeurs du formulaire
      var pseudo = document.getElementById('pseudo').value;
      var message = document.getElementById('messageInput').value;
  
      // Envoyer une requête AJAX pour enregistrer le message
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'chatcontroller.php', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = function() {
        // Traiter la réponse du serveur
        if (xhr.status === 200) {
          // Réponse réussie
          var response = JSON.parse(xhr.responseText);
          if (response.success) {
            // Le message a été enregistré avec succès
            // Faire quelque chose après l'envoi du message (par exemple, vider le champ de saisie)
            document.getElementById('messageInput').value = '';
          } else {
            // Erreur lors de l'enregistrement du message
            console.log(response.message);
          }
        } else {
          // Erreur lors de l'envoi du message
          console.log('Erreur de communication avec le serveur.');
        }
      };
      xhr.send('pseudo=' + encodeURIComponent(pseudo) + '&message=' + encodeURIComponent(message) + '&action=send');
    });
  
    // Écouter les événements de modification des messages
    var chatMessages = document.getElementsByClassName('chat-message');
    for (var i = 0; i < chatMessages.length; i++) {
      var messageElement = chatMessages[i];
      var editButton = messageElement.querySelector('.edit-button');
      var deleteButton = messageElement.querySelector('.delete-button');
  
      // Écouter l'événement de clic sur le bouton de modification
      editButton.addEventListener('click', function(event) {
        var message = this.parentElement.querySelector('.message-text').textContent;
        var messageId = this.parentElement.dataset.messageId;
  
        // Afficher le formulaire de modification avec le message existant
        var editForm = document.getElementById('editForm');
        var editInput = editForm.querySelector('#editInput');
        var messageIdInput = editForm.querySelector('#editMessageIdInput');
        editInput.value = message;
        messageIdInput.value = messageId;
        editForm.classList.add('active');
      });
  
      // Écouter l'événement de soumission du formulaire de modification
      var editForm = document.getElementById('editForm');
      editForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher le rechargement de la page
  
        // Récupérer les valeurs du formulaire de modification
        var editedMessage = document.getElementById('editInput').value;
        var editedMessageId = document.getElementById('editMessageIdInput').value;
  
        // Envoyer une requête AJAX pour modifier le message
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'chatcontroller.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
          // Traiter la réponse du serveur
          if (xhr.status === 200) {
            // Réponse réussie
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
              // Le message a été modifié avec succès
              // Faire quelque chose après la modification du message (par exemple, mettre à jour l'affichage)
              editForm.classList.remove('active');
              document.querySelector('[data-message-id="' + editedMessageId + '"] .message-text').textContent = editedMessage;
            } else {
              // Erreur lors de la modification du message
              console.log(response.message);
            }
          } else {
            // Erreur lors de la communication avec le serveur
            console.log('Erreur de communication avec le serveur.');
          }
        };
        xhr.send('message=' + encodeURIComponent(editedMessage) + '&messageId=' + encodeURIComponent(editedMessageId) + '&action=edit');
      });
  
      // Écouter l'événement de clic sur le bouton de suppression
      deleteButton.addEventListener('click', function(event) {
        var messageId = this.parentElement.dataset.messageId;
  
        // Envoyer une requête AJAX pour supprimer le message
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'chatcontroller.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
          // Traiter la réponse du serveur
          if (xhr.status === 200) {
            // Réponse réussie
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
              // Le message a été supprimé avec succès
              // Faire quelque chose après la suppression du message (par exemple, supprimer l'élément du DOM)
              messageElement.remove();
            } else {
              // Erreur lors de la suppression du message
              console.log(response.message);
            }
          } else {
            // Erreur lors de la communication avec le serveur
            console.log('Erreur de communication avec le serveur.');
          }
        };
        xhr.send('messageId=' + encodeURIComponent(messageId) + '&action=delete');
      });
    }
  });
  