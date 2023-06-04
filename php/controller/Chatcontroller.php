<?php
require_once $_SERVER['DOCUMENT_ROOT'] .  '/gaetan_yossa_chat/php/services/services.php';


//Gestion des Chats
class ChatController {
  private $chatService;
  
  public function __construct() {
    $this->chatService = new ChatService();
  }
  
  public function getAllChats() {
    $chats = $this->chatService->getAllChats();
  
    $response = [
      'success' => true,
      'chats' => $chats
    ];
  
    header('Content-Type: application/json');
    echo json_encode($response);
  }
  function getChatById($id) {
    $chat = $chatService->getChatById($id);
  
    if ($chat) {
      // Préparer la réponse JSON
      $response = [
        'success' => true,
        'data' => $chat
      ];
    } else {
      // Chat non trouvé
      $response = [
        'success' => false,
        'message' => 'Chat non trouvé'
      ];
    }
  
    echo json_encode($response);
  }
}

// Utilisation de la classe ChatController
$chatController = new ChatController();
$chatController->getAllChats();



?>
