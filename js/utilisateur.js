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
        url: 'php/controller/Utilisateurcontroller.php',
        type: 'POST',
        dataType: 'json',
        data: {
          pseudo: pseudoInput
        },
        success: function(response) {
          if (response.success) {
            // Stocker le userId dans le localStorage
            
            localStorage.setItem('userId', response.data.id);

            // Afficher un message de succès
            userPseudo = localStorage.getItem('userPseudo');
            chatId = localStorage.getItem('chatId');
            Swal.fire({
              icon: 'success',
              title: 'Bienvenue',
              text: `L'utilisateur ${userPseudo} a rejoint le chat n°${chatId}`,
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                // Rediriger vers la page du chat
                window.location.href = 'chat.html';
              }
            });
          } else {
            // Afficher un message d'erreur
            userPseudo = localStorage.getItem('userPseudo');
            Swal.fire({
              icon: 'error',
              title: 'Action impossible',
              text: `Le pseudo ${userPseudo} existe déjà!! veuillez choisir un autre pseudo`,
              confirmButtonText: 'OK'
            });
          }
        },
        error: function(error) {
          // Afficher un message d'erreur
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la création d\'un nouveau Chatteur',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }
});
