<?php
require_once 'services.php';


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
      $utilisateur = $this->utilisateurService->createUtilisateur($pseudo);
      // Préparer la réponse JSON
      $response = [
        'success' => true,
        'message' => 'Utilisateur créé avec succès',
        'data' => $utilisateur
      ];
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
  //fonction pour mettre a jour un utilisateur
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

  //Méthode pour gérer la suppression d'un utilisateur
  public function deleteUtilisateur($id) {
    $success = $this->utilisateurService->deleteUtilisateur($id);

    if ($success) {
      // Préparer la réponse JSON
      $response = [
        'success' => true,
        'message' => 'Utilisateur supprimé avec succès'
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
}

// Utilisation de la classe UtilisateurController
$utilisateurController = new UtilisateurController();

// Vérification de la présence des paramètres "pseudo" et "chatId" dans la requête POST
if (isset($_POST['pseudo']) && isset($_POST['chatId'])) {
  $pseudo = $_POST['pseudo'];
  $chatId = $_POST['chatId'];
  $utilisateurController->createUtilisateur($pseudo);
} 


?>