import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Esprit Trail collecte, utilise et protège tes données personnelles.",
};

const LAST_UPDATED = "23 avril 2026";

export default function PrivacyPage() {
  return (
    <>
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Esprit Trail — docs
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-ink">
          Politique de confidentialité
        </h1>
        <p className="mt-2 text-xs text-ink-muted">
          Dernière mise à jour : {LAST_UPDATED}
        </p>
      </div>

      <section>
        <p>
          Esprit Trail prend tes données au sérieux. Cette politique décrit ce
          qu'on collecte, pourquoi, et ce que tu peux faire avec. Elle
          respecte le Règlement Général sur la Protection des Données (RGPD).
        </p>

        <h2>1. Responsable du traitement</h2>
        <p>
          Guillaume Coulon, entrepreneur individuel. Voir{" "}
          <a href="/legal/mentions">Mentions légales</a> pour les coordonnées
          complètes.
        </p>

        <h2>2. Données collectées</h2>

        <h3>Données que tu fournis</h3>
        <ul>
          <li><strong>Identité :</strong> email, pseudo, avatar/character</li>
          <li><strong>Profil sportif :</strong> UTMB Index, ITRA, niveau, objectifs</li>
          <li><strong>Activités :</strong> runs, distance, D+, allure, GPS</li>
          <li><strong>Team, défis, badges :</strong> appartenance, classements</li>
        </ul>

        <h3>Données collectées automatiquement</h3>
        <ul>
          <li>Logs techniques (adresse IP, user agent) pour sécurité</li>
          <li>Événements d'usage (pages visitées, actions) pour améliorer l'app</li>
        </ul>

        <h3>Données tierces</h3>
        <p>
          Si tu connectes Strava, on récupère tes activités via leur API
          (token OAuth stocké chiffré). Tu peux révoquer à tout moment.
          Si tu utilises une montre Garmin, Coros ou Suunto, c'est leur sync
          Strava native qui remonte tes données — Esprit Trail n'accède pas
          directement à leurs API.
        </p>

        <h2>3. Finalités</h2>
        <ul>
          <li>Te fournir le service (compte, activités, coach IA, team)</li>
          <li>Personnaliser ton expérience (stats, recommandations)</li>
          <li>Communiquer avec toi (emails transactionnels : magic link, notifications)</li>
          <li>Sécurité et prévention de la fraude</li>
          <li>Amélioration continue du service (statistiques agrégées anonymisées)</li>
        </ul>

        <h2>4. Base légale</h2>
        <ul>
          <li><strong>Exécution du contrat :</strong> fourniture du service</li>
          <li><strong>Consentement :</strong> cookies non-essentiels, connexions tierces</li>
          <li><strong>Intérêt légitime :</strong> sécurité, amélioration produit</li>
          <li><strong>Obligation légale :</strong> conservation de certains logs</li>
        </ul>

        <h2>5. Sous-traitants et partage</h2>
        <p>Esprit Trail s'appuie sur des prestataires techniques :</p>
        <ul>
          <li><strong>Supabase</strong> (base de données, auth) — hébergement UE</li>
          <li><strong>Vercel</strong> (hébergement app) — edge network</li>
          <li><strong>Anthropic (Claude API)</strong> — coach IA, prompts traités en UE/US sans rétention</li>
          <li><strong>Strava</strong> — si tu connectes ton compte (sync sorties)</li>
        </ul>
        <p>
          Aucune donnée n'est vendue ni partagée à des fins publicitaires.
        </p>

        <h2>6. Durée de conservation</h2>
        <ul>
          <li>Compte actif : tant que ton compte existe</li>
          <li>Après suppression : effacement sous 30 jours (sauf obligation légale)</li>
          <li>Logs techniques : 12 mois</li>
        </ul>

        <h2>7. Tes droits (RGPD)</h2>
        <p>Tu as le droit à :</p>
        <ul>
          <li><strong>Accès</strong> à tes données</li>
          <li><strong>Rectification</strong> en cas d'erreur</li>
          <li><strong>Effacement</strong> (droit à l'oubli) — bouton dans{" "}
            <a href="/settings/account">/settings/account</a></li>
          <li><strong>Portabilité</strong> : export de tes données</li>
          <li><strong>Opposition</strong> au traitement</li>
          <li><strong>Limitation</strong> du traitement</li>
        </ul>
        <p>
          Pour exercer ces droits, écris à{" "}
          <a href="mailto:ravito.trail.app@gmail.com">ravito.trail.app@gmail.com</a>. Réponse
          sous 30 jours.
        </p>
        <p>
          Si tu estimes que tes droits ne sont pas respectés, tu peux saisir
          la CNIL :{" "}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            cnil.fr
          </a>
          .
        </p>

        <h2>8. Cookies</h2>
        <p>Esprit Trail utilise :</p>
        <ul>
          <li><strong>Cookies essentiels</strong> (session, auth) — pas de consentement requis</li>
          <li><strong>Cookies de préférence</strong> (mode d'affichage) — pas de consentement requis</li>
        </ul>
        <p>
          Esprit Trail n'utilise actuellement pas de cookies publicitaires ni de
          tracking tiers. Si cela change, une bannière de consentement sera
          affichée.
        </p>

        <h2>9. Sécurité</h2>
        <p>
          Tes données sont hébergées dans l'UE, chiffrées en transit (HTTPS)
          et au repos. L'accès est protégé par Row-Level Security Supabase :
          personne (pas même Esprit Trail) ne peut voir tes données sans tes
          droits.
        </p>

        <h2>10. Transferts hors UE</h2>
        <p>
          Certains sous-traitants (Vercel, Anthropic) peuvent traiter des
          données aux US dans le cadre de clauses contractuelles types (CCT)
          approuvées par la Commission européenne.
        </p>

        <h2>11. Mineurs</h2>
        <p>
          Esprit Trail est destiné aux 15 ans et plus. Si tu as moins de 15 ans,
          l'accord parental est requis. En cas de doute, contacte-nous pour
          supprimer un compte mineur.
        </p>

        <h2>12. Modifications</h2>
        <p>
          Cette politique peut évoluer. Les changements majeurs sont notifiés
          par email. La date de dernière mise à jour est indiquée en haut de
          page.
        </p>
      </section>
    </>
  );
}
