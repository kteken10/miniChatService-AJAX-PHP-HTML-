// Fonction pour récupérer les chats prédéfinis depuis le serveur
function getChats() {
  fetch('controller.php')
    .then(response => response.json())
    .then(data => {
      const chatList = document.getElementById('chat-list');
      chatList.innerHTML = '';

      data.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.textContent = chat.name;
        chatItem.addEventListener('click', () => selectChat(chat.id));
        chatList.appendChild(chatItem);
      });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des chats :', error);
    });
}

// Fonction pour sélectionner un chat et saisir le pseudo
function selectChat(chatId) {
  const pseudoInput = document.getElementById('pseudo').value;

  if (pseudoInput !== '') {
    fetch('api/utilisateurs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pseudo: pseudoInput,
        chatId: chatId
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Rediriger vers la page de chat
          window.location.href = 'chat.html';
        } else {
          console.error('Erreur lors de la création de l\'utilisateur :', data.message);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
      });
  }
}

// Fonction pour envoyer un message
function sendMessage() {
  const messageInput = document.getElementById('message-input').value;

  if (messageInput !== '') {
    const message = {
      content: messageInput,
      timestamp: new Date().toISOString()
    };

    fetch('api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Effacer le champ de saisie
          document.getElementById('message-input').value = '';
          // Mettre à jour les messages affichés
          getMessages();
        } else {
          console.error('Erreur lors de l\'envoi du message :', data.message);
        }
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi du message :', error);
      });
  }
}

// Fonction pour récupérer les messages depuis le serveur
function getMessages() {
  fetch('api/messages')
    .then(response => response.json())
    .then(data => {
      const messagesContainer = document.getElementById('messages');
      messagesContainer.innerHTML = '';

      data.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.classList.add('message-item');
        messageItem.innerHTML = `
          <p>${message.content}</p>
          <span>${message.timestamp}</span>
        `;
        messagesContainer.appendChild(messageItem);
      });

      // Faire défiler jusqu'au bas du conteneur des messages
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des messages :', error);
    });
}

// Appeler la fonction getChats() au chargement de la page d'accueil
document.addEventListener('DOMContentLoaded', getChats);

// Appeler la fonction getMessages() au chargement de la page de chat
if (window.location.pathname === '/chat.html') {
  document.addEventListener('DOMContentLoaded', getMessages);
  // Rafraîchir les messages toutes les 5 secondes
  setInterval(getMessages, 5000);
}


// Fonction pour envoyer une requête AJAX
function sendRequest(url, method, data, successCallback, errorCallback) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 400) {
      const response = JSON.parse(xhr.responseText);
      successCallback(response);
    } else {
      errorCallback(xhr.statusText);
    }
  };

  xhr.onerror = function() {
    errorCallback('Erreur réseau');
  };

  xhr.send(JSON.stringify(data));
}

// Exemple d'utilisation de la fonction sendRequest pour envoyer une requête POST
const messageData = {
  content: 'Hello world!',
  timestamp: new Date().toISOString()
};

sendRequest('api/messages', 'POST', messageData, function(response) {
  // Succès : traiter la réponse du serveur
  console.log(response);
}, function(error) {
  // Erreur : gérer l'erreur
  console.error(error);
});

// Exemple d'utilisation de la fonction sendRequest pour envoyer une requête GET
sendRequest('api/messages', 'GET', null, function(response) {
  // Succès : traiter la réponse du serveur
  console.log(response);
}, function(error) {
  // Erreur : gérer l'erreur
  console.error(error);
});
