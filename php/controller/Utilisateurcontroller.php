<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/gaetan_yossa_chat/php/services/services.php';

// Contrôleur pour gérer les requêtes relatives aux utilisateurs
class UtilisateurController {
  private $utilisateurService;

  public function __construct() {
    $this->utilisateurService = new UtilisateurService();
  }

  // Méthode pour gérer la création d'un utilisateur
  public function createUtilisateur($pseudo) {
    // Vérification des paramètres requis
    if (!empty($pseudo)) {
      $utilisateur = $this->utilisateurService->getUtilisateurByPseudo($pseudo);
      
      if ($utilisateur) {
        // L'utilisateur existe déjà
        $response = [
          'success' => false,
          'message' => 'L\'utilisateur existe déjà'
        ];
      } else {
        // Créer un nouvel utilisateur
        $utilisateur = $this->utilisateurService->createUtilisateur($pseudo);
        
        // Préparer la réponse JSON
        $response = [
          'success' => true,
          'message' => 'Utilisateur créé avec succès',
          'data' => $utilisateur
        ];
      }
      
      echo json_encode($response);
    } else {
      // Paramètres manquants
      $response = [
        'success' => false,
        'message' => 'Paramètres manquants'
      ];
      echo json_encode($response);
    }
  }

  // Méthode pour récupérer un utilisateur par son userId
  public function getUtilisateurById($userId) {
    $utilisateur = $this->utilisateurService->getUtilisateurById($userId);

    if ($utilisateur) {
      // Préparer la réponse JSON
      $response = [
        'success' => true,
        'data' => [
        'pseudo' => $utilisateur['pseudo']
          // Ajoutez d'autres informations d'utilisateur si nécessaire
        ]
      ];
    } else {
      // Utilisateur non trouvé
      $response = [
        'success' => false,
        'message' => 'Utilisateur introuvable'
      ];
    }

    echo json_encode($response);
  }

  // Fonction pour mettre à jour un utilisateur
  public function updateUtilisateur($id, $pseudo) {
    $utilisateur = $this->utilisateurService->getUtilisateurById($id);

    if ($utilisateur) {
      $utilisateur['pseudo'] = $pseudo;
      $this->utilisateurService->updateUtilisateur($utilisateur);
      // Préparer la réponse JSON
      $response = [
        'success' => true,
        'message' => 'Utilisateur mis à jour avec succès',
        'data' => $utilisateur
      ];
    } else {
      // Utilisateur non trouvé
      $response = [
        'success' => false,
        'message' => 'Utilisateur non trouvé'
      ];
    }

    echo json_encode($response);
  }

  // Méthode pour gérer la suppression d'un utilisateur
  public function deleteUtilisateur($id) {
    $success = $this->utilisateurService->deleteUtilisateur($id);

    if ($success) {
      // Préparer la réponse JSON
      $response = [
        'success' => true,
        'message' => 'Utilisateur supprimé avec succès'
      ];
      echo json_encode($response);
    } else {
      // Utilisateur non trouvé
      $response = [
        'success' => false,
        'message' => 'Utilisateur non trouvé'
      ];
      echo json_encode($response);
    }
  }
}

// Utilisation de la classe UtilisateurController
$utilisateurController = new UtilisateurController();

// Vérification du type de requête
$requestMethod = $_SERVER['REQUEST_METHOD'];

switch ($requestMethod) {
  case 'POST':
    // Vérification de la présence des paramètres "pseudo" dans la requête POST
    if (isset($_POST['pseudo'])) {
      $pseudo = $_POST['pseudo'];
      $utilisateurController->createUtilisateur($pseudo);
    }
    break;

  case 'GET':
    // Vérification de la présence du paramètre "userId" dans la requête GET
    if (isset($_GET['userId'])) {
      $userId = $_GET['userId'];
      $utilisateurController->getUtilisateurById($userId);
    }
    break;

  default:
    // Requête non prise en charge
    $response = [
      'success' => false,
      'message' => 'Requête non prise en charge'
    ];
    echo json_encode($response);
    break;
}


?>
