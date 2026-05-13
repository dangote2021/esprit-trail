# Email templates Esprit Trail

## Magic Link (Supabase Auth)

Dashboard Supabase → **Authentication → Emails → Magic Link**

### Subject
```
Le trail, il a changé — ton lien est prêt
```

### Preview text (si disponible)
```
Voici l'app qu'on attendait. Allez, on y va.
```

### Body
Copier-coller le contenu de `magic-link.html`.

### Variables disponibles
- `{{ .ConfirmationURL }}` — le lien magique (c'est le seul indispensable)
- `{{ .Email }}` — l'email du destinataire
- `{{ .SiteURL }}` — l'URL du site (`https://esprit-trail.vercel.app`)

---

## Ton éditorial

Style "Clem qui court" sans le nommer :
- tutoiement, "allez", "tranquille"
- références trail douces : pompes, casquette, gels, D+, sortie longue
- on dit "team" et jamais "guilde"
- jamais de hard-sell, zéro emoji dans les emails (le logo et le CTA parlent)
- phrases courtes, pas de jargon corporate

À réutiliser pour :
- Email de réinitialisation
- Email de confirmation d'inscription
- Email de changement d'email
