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
        url: 'controller/Messagecontroller.php',
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
        url: 'controller/Utilisateurcontroller.php',
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
          var messageContainer = $('<div>').addClass('message-container');
          var userElement = $('<div>').addClass('message-user').text(pseudo);
          var contentElement = $('<div>').addClass('message-content').text(message.contenu);
          var timestampElement = $('<div>').addClass('message-timestamp').text(message.date_creation);
  
          // Créer les icônes de modification et de suppression
          var editIcon = $('<i>').addClass('fas fa-edit edit-icon');
          var deleteIcon = $('<i>').addClass('fas fa-trash-alt delete-icon');
  
          // Ajouter les événements de clic pour les icônes
          editIcon.click(function() {
            // Action de modification du message
           
            // ...
          });
  
          deleteIcon.click(function() {
            // Obtenir le conteneur du message parent
            var messageContainer = $(this).closest('.message-container');
          
            // Obtenir l'identifiant du message à supprimer
            var messageId = messageContainer.data('message-id');
            console.log(messageId);
          
            // Appeler la fonction pour supprimer le message
            deleteMessage(messageId, messageContainer);
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
      url: 'controller/Messagecontroller.php',
      dataType: 'json',
      type: 'DELETE', // Utiliser la méthode DELETE
      data: { messageId: 438 },
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
  

  // Fonction pour récupérer les messages depuis le serveur
  function getMessages(chatId) {
    $.ajax({
      url: 'controller/Messagecontroller.php',
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
  if (window.location.pathname === '/Yossa/gaetan_yossa_chat/gaetan_yossa_chat/chat.html') {
    // Récupérer le chatId depuis le localStorage
    var chatId = localStorage.getItem('chatId');
    getMessages(chatId); // Passer le chatId à la fonction getMessages

    // Rafraîchir les messages toutes les 5 secondes
    // setInterval(function() {
    //   getMessages(chatId); // Passer le chatId à la fonction getMessages
    // }, 5000);
  }
});
