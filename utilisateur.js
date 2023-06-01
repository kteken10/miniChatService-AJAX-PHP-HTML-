$(document).ready(function() {
    var chatId; // Variable globale accessible à toutes les autres fonctions
  
    // Gestionnaire d'événement pour la soumission du formulaire
    $('#pseudo-form').submit(function(event) {
      event.preventDefault();
  
      var chatSelect = $('#chat-select');
      chatId = chatSelect.val(); // Assigner la valeur de chat-select à la variable globale chatId
  
      var pseudoInput = $('#pseudo').val();
      localStorage.setItem('userPseudo', pseudoInput);
      if (pseudoInput !== '') {
        selectChat(pseudoInput);
      }
    });
  
    function selectChat(pseudoInput) {
      if (pseudoInput !== '' && chatId !== '') {
       
        localStorage.setItem('chatId', chatId);
        $.ajax({
          url: 'controller/Utilisateurcontroller.php',
          type: 'POST',
          dataType: 'json',
          data: {
            pseudo: pseudoInput
          },
          success: function(response) {
            if (response.success) {
           // personnalisation du message utilisateur participe à un chat
           userPseudo=localStorage.getItem('userPseudo');
           userId=response.data.id;
           alert(" l'Utilisateur "+userPseudo+":   "+userId+" Vient de rejoindre le chat n°"+chatId);
           localStorage.setItem('userId', userId);
            window.location.href = 'chat.html';
            }
            else{
              userPseudo=localStorage.getItem('userPseudo');
              alert("Action Impossible !! le pseudo "+userPseudo+ " existe déja");
            }
          },
          error: function(error) {
            alert("Erreur de la création d'un nouveau Chateur");
          }
        });
      }
    }    
   
  });
  