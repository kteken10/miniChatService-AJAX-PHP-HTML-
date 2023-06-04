$(document).ready(function() {
  $('#message-form').submit(function(event) {
    event.preventDefault();

    // Récupération du contenu du message
    var messageInput = $('#message-input').val();

    // Récupérer le chatId depuis le localStorage
    var chatId = localStorage.getItem('chatId');
    var userId = localStorage.getItem('userId');

    // Vérification du contenu du message
    if (messageInput !== '') {
      // Appel de la fonction pour envoyer le message après avoir mis à jour chatId
      sendMessage(messageInput, chatId, userId);
    }
  });

  // Fonction pour envoyer un message
  function sendMessage(messageInput, chatId, userId) {
    if (messageInput !== '') {
      var message = {
        contenu: messageInput,
        id_chat: chatId, // Utiliser la valeur de chatId
        id_utilisateur: userId,
        timestamp: new Date().toISOString()
      };

      $.ajax({
        url: 'php/controller/Messagecontroller.php',
        dataType: 'json',
        type: 'POST',
        data: message,
        success: function(response) {
          if (response.success) {
            // Effacer le champ de saisie
            $('#message-input').val('');
            // Mettre à jour les messages affichés
            getMessages(chatId); // Passer le chatId à la fonction getMessages
          } else {
            console.error('Erreur lors de l\'envoi du message :', response.message);
          }
        },
        error: function(error) {
          console.error('Erreur lors de l\'envoi du message :', error);
        }
      });
    }
  }

  // Fonction pour récupérer le pseudo de l'utilisateur
  function getUserPseudo(userId) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: 'php/controller/Utilisateurcontroller.php',
        type: 'GET',
        dataType: 'json',
        data: {
          userId: userId
        },
        success: function(response) {
          if (response.success) {
            resolve(response.data.pseudo);
          } else {
            reject('Erreur lors de la récupération du pseudo de l\'utilisateur');
          }
        },
        error: function(error) {
          reject('Erreur lors de la récupération du pseudo de l\'utilisateur');
        }
      });
    });
  }

  
 // Fonction pour afficher les messages
function displayMessages(messages) {
  var messagesContainer = $('#messages');
  messagesContainer.empty();

  var getUserPromises = [];

  for (var i = messages.length - 1; i >= 0; i--) {
    var message = messages[i];

    // Récupérer le pseudo de l'utilisateur
    var getUserPromise = getUserPseudo(message.id_utilisateur);
    getUserPromises.push(getUserPromise);

    (function(message) {
      getUserPromise.then(function(pseudo) {
        // Créer les éléments HTML pour afficher le message
        var messageContainer = $('<div>').addClass('message-container').attr('data-message-id', message.id).attr('data-usermessage-id', message.id_utilisateur);
        var userElement = $('<div>').addClass('message-user').text(pseudo);
        var contentElement = $('<div>').addClass('message-content').text(message.contenu);
        var timestampElement = $('<div>').addClass('message-timestamp').text(message.date_creation);

        // Créer les icônes de modification et de suppression
        var editIcon = $('<i>').addClass('fas fa-edit edit-icon');
        var deleteIcon = $('<i>').addClass('fas fa-trash-alt delete-icon');

        // Ajouter les événements de clic pour les icônes
        editIcon.click(function() {
          // Obtenir le conteneur du message parent
          var messageContainer = $(this).closest('.message-container');

          // Obtenir l'identifiant du message à modifier
          var messageId = messageContainer.data('message-id');

          // Obtenir l'identifiant de l'utilisateur du message
          var usermessageId = messageContainer.data('usermessage-id');

          // Vérifier si l'utilisateur est autorisé à modifier le message
          if (localStorage.getItem('userId') == usermessageId) {
            // Obtenir le contenu actuel du message
            var currentContent = messageContainer.find('.message-content').text();

            // Afficher le pop-up de modification avec SweetAlert2
            Swal.fire({
              title: 'Modifier le message',
              html: '<input type="text" id="edit-message-input" class="swal2-input" value="' + currentContent + '">',
              showCancelButton: true,
              confirmButtonText: 'Enregistrer',
              cancelButtonText: 'Annuler',
              preConfirm: function() {
                return $('#edit-message-input').val();
              }
            }).then(function(result) {
              if (result.isConfirmed) {
                // Obtenir le nouveau contenu du message depuis le pop-up
                var newContent = result.value;

                // Appeler la fonction pour mettre à jour le message
                updateMessage(messageId, newContent);
              }
            });
          } else {
            Swal.fire('Accès refusé', 'Vous ne pouvez pas modifier un message dans le chat qui n\'est pas le vôtre.', 'error');
          }
        });

        deleteIcon.click(function() {
          // Obtenir le conteneur du message parent
          var messageContainer = $(this).closest('.message-container');

          // Obtenir l'identifiant du message à supprimer et vérifier si l'utilisateur a le droit de supprimer ce message
          var messageId = messageContainer.data('message-id');
          var usermessageId = messageContainer.data('usermessage-id');

          // Vérifier les conditions pour afficher le pop-up de confirmation
          if (localStorage.getItem('userId') == usermessageId) {
            // Afficher le pop-up de confirmation avec SweetAlert2
            Swal.fire({
              title: 'Confirmation de suppression',
              text: 'Êtes-vous sûr de vouloir supprimer ce message ?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Supprimer',
              cancelButtonText: 'Annuler'
            }).then(function(result) {
              if (result.isConfirmed) {
                // Appeler la fonction pour supprimer le message
                deleteMessage(messageId, messageContainer);

                // Afficher une alerte de suppression réussie avec SweetAlert2
                Swal.fire('Suppression réussie', 'Le message a été supprimé avec succès.', 'success');
              }
            });
          } else {
            Swal.fire('Accès refusé', 'Vous ne pouvez pas supprimer un message dans le chat qui n\'est pas le vôtre.', 'error');
          }
        });

        // Créer le conteneur des icônes
        var iconsContainer = $('<div>').addClass('message-icons');
        iconsContainer.append(editIcon, deleteIcon);

        // Ajouter les éléments au conteneur du message
        var messageContentContainer = $('<div>').addClass('message-content-container');
        messageContentContainer.append(contentElement, iconsContainer);
        messageContainer.append(userElement, messageContentContainer, timestampElement);
        messagesContainer.append(messageContainer);

        // Faire défiler jusqu'au bas du conteneur des messages
        messagesContainer.scrollTop(messagesContainer.prop('scrollHeight'));
      }).catch(function(error) {
        console.error('Erreur lors de la récupération du pseudo de l\'utilisateur :', error);
      });
    })(message);
  }

  // Attendre que toutes les promesses de récupération du pseudo soient résolues
  Promise.all(getUserPromises).catch(function(error) {
    console.error('Erreur lors de la récupération des pseudos des utilisateurs :', error);
  });
}

function deleteMessage(messageId, messageContainer) {
  // Faire une requête AJAX pour supprimer le message en utilisant l'identifiant
  $.ajax({
    url: 'php/controller/Messagecontroller.php',
    dataType: 'json',
    type: 'DELETE', // Utiliser la méthode DELETE
    data: { messageId: messageId },
    success: function(response) {
      if (response.success) {
        // Supprimer le conteneur du message de l'interface
        messageContainer.remove();
      } else {
        console.error('Erreur lors de la suppression du message :', response.message);
      }
    },
    error: function(error) {
      console.error('Erreur lors de la suppression du message :', error);
    }
  });
}

function updateMessage(messageId, newContent) {
  // Faire une requête AJAX pour mettre à jour le message en utilisant l'identifiant et le nouveau contenu
  $.ajax({
    url: 'php/controller/Messagecontroller.php',
    dataType: 'json',
    type: 'PUT', // Utiliser la méthode PUT
    data: {
      id: messageId,
      contenu: newContent
    },
    success: function(response) {
      if (response.success) {
        // Mettre à jour le contenu du message dans l'interface
        var messageContainer = $('.message-container[data-message-id="' + messageId + '"]');
        messageContainer.find('.message-content').text(newContent);

        // Mettre à jour la date du message dans l'interface
        var timestampElement = messageContainer.find('.message-timestamp');
        var currentDate = new Date();
        var formattedDate = currentDate.toLocaleString(); // ou utilisez un format de date approprié
        timestampElement.text(formattedDate);

        // Afficher une alerte de mise à jour réussie avec SweetAlert2
        Swal.fire('Mise à jour réussie', 'Le message a été modifié avec succès.', 'success');
      } else {
        console.error('Erreur lors de la mise à jour du message :', response.message);
      }
    },
    error: function(error) {
      console.error('Erreur lors de la mise à jour du message :', error);
    }
  });
}


  // Fonction pour récupérer les messages depuis le serveur
  function getMessages(chatId) {
    $.ajax({
      url: 'php/controller/Messagecontroller.php',
      type: 'GET',
      dataType: 'json',
      data: {
        chatId: chatId // Passer le chatId en tant que paramètre de requête
      },
      success: function(response) {
        if (response.success) {
          var messages = response.data;
          displayMessages(messages); // Afficher les messages
        } else {
          console.error('Erreur lors de la récupération des messages :', response.message);
        }
      },
      error: function(error) {
        console.error('Erreur lors de la récupération des messages :', error);
      }
    });
  }

  // Appeler la fonction getMessages() au chargement de la page de chat
  if (window.location.pathname === '/gaetan_yossa_chat/chat.html') {
    // Récupérer le chatId depuis le localStorage
    var chatId = localStorage.getItem('chatId');
    getMessages(chatId); // Passer le chatId à la fonction getMessages

    // Rafraîchir les messages toutes les 5 secondes
    // setInterval(function() {
    //   getMessages(chatId); // Passer le chatId à la fonction getMessages
    // }, 5000);
  }
});
