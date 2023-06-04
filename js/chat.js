$(document).ready(function() {
    var chatId; // Variable globale accessible à toutes les autres fonctions
  
    // Fonction pour récupérer et afficher la liste des chats
    function afficherListeChats() {
      $.ajax({
        url: 'php/controller/Chatcontroller.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
          if (response.success) {
            var chats = response.chats;
            var chatListDiv = $('#chat-list');
            var selectChat = $('<select id="chat-select" class="form-control">');
  
            // chatListDiv.empty();
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

    // Appeler la fonction pour récupérer la liste des chats au chargement de la page
    afficherListeChats();
   
  });
  