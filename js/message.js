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

      console.log(messageInput);
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

  // Fonction pour récupérer les messages depuis le serveur
  function getMessages(chatId) {
    console.log("rafraichissement");
    $.ajax({
      url: 'controller/Messagecontroller.php',
      type: 'GET',
      dataType: 'json',
      data: {
        chatId: chatId // Passer le chatId en tant que paramètre de requête
      },
      success: function(response) {
        var messagesContainer = $('#messages');
        messagesContainer.empty();

        var messages = Array.isArray(response.data) ? response.data : [response.data];
        var messagesContainer = $('#messages');
        messagesContainer.empty();
        
        for (var i = 0; i < messages.length; i++) {
          var message = messages[i];
          getUser(message.id_utilisateur);
          // console.log(user_pseudo);
          var messageContainer = $('<div>').addClass('message-container');
          var userPseudo = localStorage.getItem('userPseudo');
        
          var userElement = $('<div>').addClass('message-user').text(userPseudo);
          var contentElement = $('<div>').addClass('message-content').text(message.contenu);
          var timestampElement = $('<div>').addClass('message-timestamp').text(message.date_creation);
        
          messageContainer.append(userElement, contentElement, timestampElement);
          messagesContainer.append(messageContainer);
        }

        // Faire défiler jusqu'au bas du conteneur des messages
        messagesContainer.scrollTop(messagesContainer.prop('scrollHeight'));
      },
      error: function(error) {
        console.error('Erreur lors de la récupération des messages :', error);
      }
    });
  }

  function getUser(userId) {
    $.ajax({
      url: 'controller/UserController.php',
      type: 'GET',
      dataType: 'json',
      data: {
        userId: userId // Passer le userId en tant que paramètre de requête
      },
      success: function(response) {
        if (response.success) {
          var userPseudo = response.pseudo;
          localStorage.setItem('userPseudo', userPseudo);
        } else {
          console.error('Erreur lors de la récupération de l\'utilisateur :', response.message);
        }
      },
      error: function(error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      }
    });
  }

  // ...

  // Appeler la fonction getMessages() au chargement de la page de chat
  if (window.location.pathname === '/Yossa/gaetan_yossa_chat/gaetan_yossa_chat/chat.html') {
    // Récupérer le chatId depuis le localStorage
    var chatId = localStorage.getItem('chatId');
    getMessages(chatId); // Passer le chatId à la fonction getMessages

    // Rafraîchir les messages toutes les 5 secondes
    setInterval(function() {
      getMessages(chatId); // Passer le chatId à la fonction getMessages
    }, 5000);
  }
});
