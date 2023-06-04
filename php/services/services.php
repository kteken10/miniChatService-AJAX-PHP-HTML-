<?php
require_once $_SERVER['DOCUMENT_ROOT'] .  '/gaetan_yossa_chat/php/dao/dao.php';

// Classe de service pour gérer les utilisateurs
class UtilisateurService {
  private $utilisateurDAO;

  public function __construct() {
    $this->utilisateurDAO = new UtilisateurDAO();
  }

  // Méthode pour récupérer un utilisateur par son ID
  public function getUtilisateurById($id) {
    return $this->utilisateurDAO->getById($id);
  }

  // Méthode pour récupérer un utilisateur par son pseudo
  public function getUtilisateurByPseudo($pseudo) {
    return $this->utilisateurDAO->getByPseudo($pseudo);
  }

  // Méthode pour créer un nouvel utilisateur
  public function createUtilisateur($pseudo) {
    $id = $this->utilisateurDAO->insert($pseudo);
    return $this->getUtilisateurById($id);
  }

  // Méthode pour mettre à jour les informations d'un utilisateur
  public function updateUtilisateur($utilisateur) {
    return $this->utilisateurDAO->update($utilisateur);
  }

  // Méthode pour supprimer un utilisateur
  public function deleteUtilisateur($id) {
    return $this->utilisateurDAO->delete($id);
  }
}

// Classe de service pour gérer les chats
class ChatService {
  private $chatDAO;

  public function __construct() {
    $this->chatDAO = new ChatDAO();
  }

  // Méthode pour récupérer tous les chats prédéfinis
  public function getAllChats() {
    return $this->chatDAO->getAll();
  }

  // Méthode pour récupérer un chat par son ID
  public function getChatById($id) {
    return $this->chatDAO->getById($id);
  }
}

// Classe de service pour gérer les messages
class MessageService {
  private $messageDAO;

  public function __construct() {
    $this->messageDAO = new MessageDAO();
  }

  // Méthode pour créer un nouveau message
  public function createMessage($message) {
    $id = $this->messageDAO->insert($message);
    return $this->getMessageById($id);
  }

  // Méthode pour mettre à jour un message
  public function updateMessage($message) {
    return $this->messageDAO->update($message);
  }

  // Méthode pour supprimer un message
  public function deleteMessage($id) {
    return $this->messageDAO->delete($id);
  }
  
 // Méthode pour récupérer les messages en fonction de l'ID du chat
 public function getMessagesByChat($chatId) {
  return $this->messageDAO->getMessagesByChat($chatId);
  }
  // Méthode pour récupérer un message par son ID
  public function getMessageById($id) {
    return $this->messageDAO->getById($id);
  }
}

?>
