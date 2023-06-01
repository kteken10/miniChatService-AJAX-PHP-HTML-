<?php
require_once 'services.php';

// Contrôleur pour gérer les requêtes relatives aux messages
class MessageController {
  private $messageService;

  public function __construct() {
    $this->messageService = new MessageService();
  }

  // Méthode pour gérer la création d'un message
  public function createMessage($message) {
    $message = $this->messageService->createMessage($message);
    // Préparer la réponse JSON
    $response = [
      'success' => true,
      'message' => 'Message créé avec succès',
      'data' => $message
    ];
    echo json_encode($response);
  }

  // Méthode pour gérer la mise à jour d'un message
  public function updateMessage($message) {
    $success = $this->messageService->updateMessage($message);

    if ($success) {
      // Préparer la réponse JSON
      $response = [
        'success' => true,
        'message' => 'Message mis à jour avec succès'
      ];
    } else {
      // Message non trouvé
      $response = [
        'success' => false,
        'message' => 'Message non trouvé'
      ];
    }

    echo json_encode($response);
  }

  // Méthode pour gérer la suppression d'un message
  public function deleteMessage($id) {
    $success = $this->messageService->deleteMessage($id);

    if ($success) {
      // Préparer la réponse JSON
      $response = [
        'success' => true,
        'message' => 'Message supprimé avec succès'
      ];
    } else {
      // Message non trouvé
      $response = [
        'success' => false,
        'message' => 'Message non trouvé'
      ];
    }

    echo json_encode($response);
  }
}

// Vérification de la méthode de la requête HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Création d'une instance de MessageController
$messageController = new MessageController();

// Traitement des différentes méthodes de requête
switch ($method) {
    case 'POST':
     
        $data = $_POST;
       
  
        // Accéder aux valeurs du tableau associatif
       
    

        // Affichage des données pour débogage
        error_log('POST data: ' . print_r($data, true));

        // Appel de la méthode createMessage avec les données du message
        $messageController->createMessage($data);
        break;

    case 'PUT':
        // Récupération des données JSON de la requête
        $data = json_decode(file_get_contents('php://input'), true);

        // Affichage des données pour débogage
        error_log('PUT data: ' . print_r($data, true));

        // Appel de la méthode updateMessage avec les données du message
        $messageController->updateMessage($data);
        break;

    case 'DELETE':
        // Récupération de l'ID du message à supprimer
        $id = $_GET['id'];

        // Affichage de l'ID pour débogage
        error_log('DELETE message ID: ' . $id);

        // Appel de la méthode deleteMessage avec l'ID du message
        $messageController->deleteMessage($id);
        break;

    default:
        // Méthode non prise en charge
        $response = [
            'success' => false,
            'message' => 'Méthode non prise en charge'
        ];

        // Affichage de l'erreur pour débogage
        error_log('Unsupported method: ' . $method);
        echo json_encode($response);
        break;
}


?>