import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGU",
  description:
    "Conditions générales d'utilisation de l'application Esprit Trail.",
};

const LAST_UPDATED = "23 avril 2026";

export default function CguPage() {
  return (
    <>
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Esprit Trail — docs
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-ink">
          Conditions Générales d'Utilisation
        </h1>
        <p className="mt-2 text-xs text-ink-muted">
          Dernière mise à jour : {LAST_UPDATED}
        </p>
      </div>

      <section>
        <h2>Préambule</h2>
        <p>
          Esprit Trail est une application destinée aux pratiquants de trail. Elle
          permet de cumuler de l'activité, rejoindre une team, suivre un plan
          coach IA, découvrir des off races et partager ses sorties.
        </p>
        <p>
          L'utilisation de Esprit Trail implique l'acceptation pleine et entière des
          présentes Conditions Générales d'Utilisation (« CGU »). En créant
          un compte, tu acceptes ces CGU.
        </p>

        <h2>1. Éditeur</h2>
        <p>
          L'application Esprit Trail est éditée par Guillaume Coulon, entrepreneur
          individuel. Les coordonnées complètes figurent sur la page{" "}
          <a href="/legal/mentions">Mentions légales</a>.
        </p>

        <h2>2. Accès au service</h2>
        <p>
          L'accès à Esprit Trail est gratuit. Un compte est nécessaire pour utiliser
          les fonctions personnalisées (coach IA, team, stats, synchro
          montre). L'authentification se fait par lien magique envoyé par
          email, ou via Google/Strava.
        </p>
        <p>
          L'utilisateur doit avoir au moins 15 ans pour créer un compte. En
          dessous, l'accord d'un représentant légal est nécessaire.
        </p>

        <h2>3. Usage attendu</h2>
        <p>Tu t'engages à utiliser Esprit Trail de bonne foi :</p>
        <ul>
          <li>pas de triche sur les performances (GPS falsifié, temps bidonnés)</li>
          <li>pas d'insultes, harcèlement ou contenu illégal dans la communauté</li>
          <li>pas de scraping massif ni d'usage automatisé non autorisé</li>
          <li>pas de contournement des limites techniques ou de l'authentification</li>
        </ul>
        <p>
          Tout manquement peut entraîner la suspension ou la suppression du
          compte sans préavis.
        </p>

        <h2>4. Contenus utilisateur</h2>
        <p>
          Tu restes propriétaire des contenus que tu postes (activités,
          photos, commentaires). En les publiant sur Esprit Trail, tu accordes à
          Esprit Trail une licence non exclusive, mondiale et gratuite pour les
          afficher, les indexer et les partager dans le cadre du service,
          pour la durée d'utilisation de ton compte.
        </p>
        <p>
          Tu garantis détenir les droits sur les contenus partagés. Tu peux
          supprimer tes contenus à tout moment depuis l'app.
        </p>

        <h2>5. Coach IA</h2>
        <p>
          Le coach IA génère des plans d'entraînement à titre indicatif. Il
          ne remplace pas un avis médical ni un coach humain certifié. Tu
          restes seul responsable de ta pratique sportive et de ton état de
          santé. En cas de doute, consulte un médecin.
        </p>

        <h2>6. Données tierces (Strava)</h2>
        <p>
          Quand tu connectes Strava, Esprit Trail récupère tes activités via leur
          API officielle. Tu peux déconnecter à tout moment depuis{" "}
          <a href="/settings/connections">/settings/connections</a>. Les
          tokens OAuth sont chiffrés côté serveur Supabase. Si tu utilises
          une montre Garmin, Coros ou Suunto, c'est leur sync Strava native
          qui remonte tes données — Esprit Trail n'a pas d'intégration directe.
        </p>

        <h2>7. Propriété intellectuelle</h2>
        <p>
          La marque Esprit Trail, le code source, le design et les contenus édités
          par Esprit Trail sont protégés. Toute reproduction sans autorisation est
          interdite.
        </p>

        <h2>8. Responsabilité</h2>
        <p>
          Esprit Trail est fourni « tel quel ». L'éditeur ne garantit pas
          l'absence d'interruption, de bug ou de perte de données.
          L'éditeur ne peut être tenu responsable des dommages indirects,
          pertes de performance sportive, blessures ou préjudices liés à
          l'usage du service.
        </p>

        <h2>9. Résiliation</h2>
        <p>
          Tu peux supprimer ton compte à tout moment depuis{" "}
          <a href="/settings/account">/settings/account</a>. La suppression
          est définitive et entraîne l'effacement de tes données dans un
          délai de 30 jours (sauf obligations légales de conservation).
        </p>

        <h2>10. Modification des CGU</h2>
        <p>
          Esprit Trail peut modifier ces CGU. Les utilisateurs sont informés par
          email. La poursuite de l'usage vaut acceptation des nouvelles
          conditions.
        </p>

        <h2>11. Droit applicable — Litiges</h2>
        <p>
          Les présentes CGU sont régies par le droit français. En cas de
          litige, une solution amiable sera recherchée en priorité. À
          défaut, les tribunaux français seront compétents. Les
          consommateurs peuvent recourir à la plateforme européenne de
          règlement des litiges en ligne :{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>

        <h2>12. Contact</h2>
        <p>
          Pour toute question :{" "}
          <a href="mailto:ravito.trail.app@gmail.com">ravito.trail.app@gmail.com</a>
        </p>
      </section>
    </>
  );
}
