$(document).ready(function() {
    // GESTION DES CHATS (récupération des chats)
  
    // Fonction pour récupérer et afficher la liste des chats
    afficherListeChats();

    //Variabl globales accessible à toutes les autres fonction
   
    function afficherListeChats() {
      $.ajax({
        url: 'controller.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
          if (response.success) {
            var chats = response.chats;
            var chatListDiv = $('#chat-list');
            var selectChat = $('<select id="chat-select">');
  
            chatListDiv.empty();
  
            for (var i = 0; i < chats.length; i++) {
              var chat = chats[i];
              var optionChat = $('<option>').val(chat.id).text(chat.nom);
              selectChat.append(optionChat);
            }
  
            chatListDiv.append(selectChat);
          } else {
            console.log('Erreur lors de la récupération des chats.');
          }
        },
        error: function() {
          console.log('Erreur lors de la requête AJAX.');
        }
      });
    }
  
    // Gestion des Utilisateurs
  
    // Gestionnaire d'événement pour la soumission du formulaire
    $('#pseudo-form').submit(function(event) {
      event.preventDefault();
  
       chatSelect = $('#chat-select');
       chatId = chatSelect.val();
      
      var pseudoInput = $('#pseudo').val();
     
  
      if (pseudoInput !== '') {
        selectChat(chatId, pseudoInput);
      }
    });

    function selectChat(chatId, pseudoInput) {
     
      
      if (pseudoInput !== '' && chatId !== '') {
        $.ajax({
          url: 'utilisateur.php',
          type: 'POST',
          data: {
            pseudo: pseudoInput,
            chatId: chatId
          },
          success: function(response) {
            if (!response.success) {
              console.log('Tout fonctionne correctement.');
              window.location.href = 'chat.html';
            }
          },
          error: function(error) {
            console.error('Erreur lors de la création de l\'utilisateur :', error.responseText);
          }
        });
      }
    }
  
    $('#message-form').submit(function(event) {
      event.preventDefault();
  
      // Récupération du contenu du message
      var messageInput = $('#message-input').val();
  
      // Vérification du contenu du message
      if (messageInput !== '') {
        // Appel de la fonction pour envoyer le message
        sendMessage(messageInput);
      }
    });
  
  
    // Fonction pour envoyer un message
    function sendMessage(messageInput) {
      if (messageInput !== '') {
        var message = {
          contenu: messageInput,
          id_chat: 2,
          timestamp: new Date().toISOString()
        };
       
        console.log(messageInput);
        $.ajax({
          url: 'message.php',
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
  
    // Appeler la fonction getMessages() au chargement de la page de chat
    if (window.location.pathname === '/chat.html') {
      getMessages();
      // Rafraîchir les messages toutes les 5 secondes
      setInterval(getMessages, 5000);
    }
  });
  