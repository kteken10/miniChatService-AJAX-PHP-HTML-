$(document).ready(function() {
   
  
    $('#message-form').submit(function(event) {
      event.preventDefault();
  
      // Récupération du contenu du message
      var messageInput = $('#message-input').val();
    
      // Récupérer le chatId depuis le localStorage
      var chatId = localStorage.getItem('chatId');
      var userId=localStorage.getItem('userId');
  
      // Vérification du contenu du message
      if (messageInput !== '') {
        // Appel de la fonction pour envoyer le message après avoir mis à jour chatId
        sendMessage(messageInput,chatId,userId);
      }
    });
  
    // Fonction pour envoyer un message
    function sendMessage(messageInput,chatId,userId) {
    
      if (messageInput !== '') {
        var message = {
          contenu: messageInput,
          id_chat: chatId, // Utiliser la valeur de chatId
          id_utilisateur: userId,
          timestamp: new Date().toISOString()
        };
  
        console.log(messageInput);
        $.ajax({
          url: 'message.php',
          dataType: 'json',
          type: 'POST',
          data: message,
          success: function(response) {
            if (response.success) {
              // Effacer le champ de saisie
              $('#message-input').val('');
              // Mettre à jour les messages affichés
              getMessages();
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
  
    // Fonction pour récupérer les messages depuis le serveur
    function getMessages() {
      $.ajax({
        url: 'message.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
          var messagesContainer = $('#messages');
          messagesContainer.empty();
  
          // Convertir la réponse JSON en tableau
          var messages = Array.isArray(response) ? response : [response];
  
          messages.forEach(function(message) {
            var messageItem = $('<div>').addClass('message-item');
            messageItem.html(`
              <p>${message.contenu}</p>
              <span>${message.timestamp}</span>
            `);
            messagesContainer.append(messageItem);
          });
  
          // Faire défiler jusqu'au bas du conteneur des messages
          messagesContainer.scrollTop(messagesContainer.prop('scrollHeight'));
        },
        error: function(error) {
          console.error('Erreur lors de la récupération des messages :', error);
        }
      });
    }
  
    // Appeler la fonction pour récupérer la liste des chats au chargement de la page
    afficherListeChats();
  
    // Appeler la fonction getMessages() au chargement de la page de chat
    if (window.location.pathname === '/chat.html') {
      getMessages();
      // Rafraîchir les messages toutes les 5 secondes
      setInterval(getMessages, 5000);
    }
  });
  