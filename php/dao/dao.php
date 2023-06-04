<?php
// Classe DAO pour l'entité "Utilisateur"
class UtilisateurDAO {
  // Méthode pour récupérer un utilisateur par son ID
  public function getById($id) {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=chat_db", "root", "");

    // Requête SQL pour récupérer l'utilisateur par son ID
    $query = "SELECT * FROM utilisateurs WHERE id = :id";
    $statement = $pdo->prepare($query);
    $statement->bindParam(":id", $id);
    $statement->execute();

    // Récupération des données
    $utilisateur = $statement->fetch(PDO::FETCH_ASSOC);

    // Retourne l'utilisateur (ou null s'il n'existe pas)
    return $utilisateur ? $utilisateur : null;
  }

  // Méthode pour récupérer un utilisateur par son pseudo
  public function getByPseudo($pseudo) {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=chat_db", "root", "");

    // Requête SQL pour récupérer l'utilisateur par son pseudo
    $query = "SELECT * FROM utilisateurs WHERE pseudo = :pseudo";
    $statement = $pdo->prepare($query);
    $statement->bindParam(":pseudo", $pseudo);
    $statement->execute();

    // Récupération des données
    $utilisateur = $statement->fetch(PDO::FETCH_ASSOC);

    // Retourne l'utilisateur (ou null s'il n'existe pas)
    return $utilisateur ? $utilisateur : null;
  }


  // Méthode pour insérer un nouvel utilisateur dans la base de données
  public function insert($pseudo) {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=chat_db", "root", "");

    // Requête SQL pour insérer un nouvel utilisateur
    $query = "INSERT INTO utilisateurs (pseudo) VALUES (:pseudo)";
    $statement = $pdo->prepare($query);
    $statement->bindParam(":pseudo", $pseudo);
    $statement->execute();

    // Retourne l'ID de l'utilisateur nouvellement inséré
    return $pdo->lastInsertId();
  }

  // Méthode pour mettre à jour les informations d'un utilisateur dans la base de données
  public function update($utilisateur) {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=chat_db", "root", "");

    // Requête SQL pour mettre à jour les informations de l'utilisateur
    $query = "UPDATE utilisateurs SET pseudo = :pseudo WHERE id = :id";
    $statement = $pdo->prepare($query);
    $statement->bindParam(":pseudo", $utilisateur['pseudo']);
    $statement->bindParam(":id", $utilisateur['id']);
    $statement->execute();

    // Retourne true si la mise à jour a réussi, sinon false
    return $statement->rowCount() > 0;
  }

  // Méthode pour supprimer un utilisateur de la base de données
  public function delete($id) {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=chat_db", "root", "");

    // Requête SQL pour supprimer l'utilisateur
    $query = "DELETE FROM utilisateurs WHERE id = :id";
    $statement = $pdo->prepare($query);
    $statement->bindParam(":id", $id);
    $statement->execute();

    // Retourne true si la suppression a réussi, sinon false
    return $statement->rowCount() > 0;
  }
}

// Classe DAO pour l'entité "Chat"
class ChatDAO {
  // Méthode pour récupérer la liste des chats prédéfinis
  public function getAll() {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=chat_db", "root", "");

    // Requête SQL pour récupérer tous les chats prédéfinis
    $query = "SELECT * FROM chats";
    $statement = $pdo->query($query);

    // Récupération des données
    $chats = $statement->fetchAll(PDO::FETCH_ASSOC);

    // Retourne la liste des chats
    return $chats;
  }

  // Méthode pour récupérer un chat par son ID
  public function getById($id) {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=chat_db", "root", "");

    // Requête SQL pour récupérer le chat par son ID
    $query = "SELECT * FROM chats WHERE id = :id";
    $statement = $pdo->prepare($query);
    $statement->bindParam(":id", $id);
    $statement->execute();

    // Récupération des données
    $chat = $statement->fetch(PDO::FETCH_ASSOC);

    // Retourne le chat (ou null s'il n'existe pas)
    return $chat ? $chat : null;
  }
}

// Classe DAO pour l'entité "Message"
class MessageDAO {
  // Méthode pour insérer un nouveau message dans la base de données
  public function insert($message) {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=chat_db", "root", "");

    // Requête SQL pour insérer un nouveau message
    
    $query = "INSERT INTO messages (contenu, id_utilisateur, id_chat) VALUES (:contenu, :id_utilisateur, :id_chat)";
    $statement = $pdo->prepare($query);
    $statement->bindParam(":contenu", $message['contenu']);
    $statement->bindParam(":id_utilisateur", $message['id_utilisateur']);
    $statement->bindParam(":id_chat", $message['id_chat']);
    $statement->execute();

    // Retourne l'ID du message nouvellement inséré
    return $pdo->lastInsertId();
  }

 
  // Méthode pour mettre à jour un message dans la base de données
  public function update($message) {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=chat_db", "root", "");

    // Requête SQL pour mettre à jour un message
    $query = "UPDATE messages SET contenu = :contenu, date_modification = NOW() WHERE id = :id";
    $statement = $pdo->prepare($query);
    $statement->bindParam(":contenu", $message['contenu']);
    $statement->bindParam(":id", $message['id']);
    $statement->execute();

    // Retourne true si la mise à jour a réussi, sinon false
    return $statement->rowCount() > 0;
  }
  // Méthode pour récupérer les messages par l'ID du chat
  public function getMessagesByChat($chatId) {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=chat_db", "root", "");

    // Requête SQL pour récupérer les messages par l'ID du chat
    $query = "SELECT * FROM messages WHERE id_chat = :chatId ORDER BY id DESC";
    $statement = $pdo->prepare($query);
    $statement->bindParam(":chatId", $chatId);
    $statement->execute();

    // Récupération des données
    $messages = $statement->fetchAll(PDO::FETCH_ASSOC);

    // Retourne les messages (ou un tableau vide s'il n'y en a pas)
    return $messages ? $messages : [];
  }


  // Méthode pour récupérer un message par son ID
  public function getById($id) {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=chat_db", "root", "");

    // Requête SQL pour récupérer le message par son ID
    $query = "SELECT * FROM messages WHERE id = :id";
    $statement = $pdo->prepare($query);
    $statement->bindParam(":id", $id);
    $statement->execute();

    // Récupération des données
    $message = $statement->fetch(PDO::FETCH_ASSOC);

    // Retourne le message (ou null s'il n'existe pas)
    return $message ? $message : null;
  }
  // Méthode pour supprimer un message de la base de données
  public function delete($id) {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=chat_db", "root", "");

    // Requête SQL pour supprimer le message
    $query = "DELETE FROM messages WHERE id = :id";
    $statement = $pdo->prepare($query);
    $statement->bindParam(":id", $id);
    $statement->execute();

    // Retourne true si la suppression a réussi, sinon false
    return $statement->rowCount() > 0;
  }
}
?>
