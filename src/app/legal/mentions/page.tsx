import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Informations légales de l'éditeur de l'application Esprit Trail.",
};

export default function MentionsPage() {
  return (
    <>
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Esprit Trail — docs
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-ink">
          Mentions légales
        </h1>
      </div>

      <p className="-mt-3 mb-6 text-xs text-ink-muted">
        Dernière mise à jour : 30 avril 2026
      </p>

      <section>
        <h2>Éditeur</h2>
        <p>
          <strong>Esprit Trail</strong>
          <br />
          Guillaume Coulon — entrepreneur individuel
          <br />
          SIRET : <em>à compléter avant publication stores</em>
          <br />
          Email :{" "}
          <a href="mailto:esprit.trail.app@gmail.com">esprit.trail.app@gmail.com</a>
          <br />
          Directeur de la publication : Guillaume Coulon
        </p>

        <h2>Hébergement</h2>
        <p>
          <strong>Vercel Inc.</strong>
          <br />
          440 N Barranca Ave #4133
          <br />
          Covina, CA 91723, USA
          <br />
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            vercel.com
          </a>
        </p>

        <h2>Base de données et authentification</h2>
        <p>
          <strong>Supabase Inc.</strong> (hébergement UE — région eu-west-3)
          <br />
          970 Toa Payoh North #07-04
          <br />
          Singapore 318992
          <br />
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            supabase.com
          </a>
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble du site (code, design, contenu, marque Esprit Trail) est
          protégé par le droit de la propriété intellectuelle. Toute
          reproduction sans autorisation est interdite.
        </p>
        <p>
          Les marques tierces citées (Strava, Garmin, Coros, Suunto, UTMB,
          ITRA, etc.) restent la propriété de leurs détenteurs respectifs.
        </p>

        <h2>Contact</h2>
        <p>
          Pour toute question légale :{" "}
          <a href="mailto:esprit.trail.app@gmail.com">esprit.trail.app@gmail.com</a>
          <br />
          Pour les questions de données personnelles :{" "}
          <a href="mailto:esprit.trail.app@gmail.com">esprit.trail.app@gmail.com</a>
        </p>

        <h2>Crédits</h2>
        <p>
          Design et développement : l'équipe Esprit Trail. Fait avec les pieds
          boueux, quelque part entre une sortie longue et un ravitaillement.
        </p>
      </section>
    </>
  );
}
