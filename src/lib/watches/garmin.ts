// ====== GARMIN — désactivé au lancement ======
//
// Décision MVP (28/04/26) : pas d'intégration Garmin native.
// Les utilisateurs Garmin connectent leur montre à Strava (sync native du
// device), et Esprit Trail récupère les sorties via Strava. C'est le chemin le plus
// court vers la valeur, sans dépendance au programme partenaire Garmin Health
// qui demande une validation manuelle longue.
//
// On rouvrira l'intégration native plus tard si la base utilisateurs le
// justifie. Le scaffold OAuth 1.0a + activity mapper a été retiré pour ne
// pas laisser de code mort dans le bundle.

export {};
