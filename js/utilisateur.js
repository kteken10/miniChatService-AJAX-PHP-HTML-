$(document).ready(function() {
    var chatId; // Variable globale accessible à toutes les autres fonctions
  
    // Gestionnaire d'événement pour la soumission du formulaire
    $('#pseudo-form').submit(function(event) {
      event.preventDefault();
  
      var chatSelect = $('#chat-select');
      chatId = chatSelect.val(); // Assigner la valeur de chat-select à la variable globale chatId
  
      var pseudoInput = $('#pseudo').val();
  
      if (pseudoInput !== '') {
        selectChat(pseudoInput);
      }
    });
  
    function selectChat(pseudoInput) {
      if (pseudoInput !== '' && chatId !== '') {
       
        localStorage.setItem('chatId', chatId);
        $.ajax({
          url: 'utilisateur.php',
          dataType: 'json',
          type: 'POST',
          data: {
            pseudo: pseudoInput
          },
          success: function(response) {
            if (response.success) {
           // personnalisation du message utilisateur participe à un chat
           userPseudo=response.data.pseudo;
           userId=response.data.id;
           alert(" l'Utilisateur "+userPseudo+":   "+userId+" Vient de rejoindre le chat n°"+chatId);
           localStorage.setItem('userId', userId);
            window.location.href = 'chat.html';
            }
          },
          error: function(error) {
            console.error('Erreur lors de la création de l\'utilisateur :', error.responseText);
          }
        });
      }
    }    
   
  });
  