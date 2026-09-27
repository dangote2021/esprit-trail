-- ====== RAVITO / ESPRIT TRAIL — RETRAIT INTÉGRATION STRAVA ======
-- Strava a refusé l'accès à son API pour cette app (motif invoqué : usage
-- d'IA sur les données Strava). L'intégration OAuth/webhooks Strava est
-- retirée du code ; cette migration aligne le schéma en conséquence.
--
-- NB : le dossier supabase/migrations/ de ce repo ne reflète plus depuis
-- longtemps l'historique réel des migrations appliquées au projet Supabase
-- (nombreuses migrations appliquées directement via l'éditeur SQL / MCP
-- depuis 0001_initial_schema.sql — RLS hardening, messagerie, quêtes,
-- webhooks Strava eux-mêmes, etc.). Ce fichier documente uniquement le
-- changement ci-dessous, déjà appliqué en production.

-- 1) Purge défensive (0 lignes attendues — jamais aucune connexion Strava
--    n'a été établie en production : user_integrations et les runs
--    source='strava' étaient déjà vides).
delete from public.user_integrations where provider = 'strava';
delete from public.runs where source = 'strava';

-- 2) Tables dédiées aux webhooks Strava : plus aucune route ne les utilise
--    (src/app/api/webhooks/strava/* a été supprimé).
drop table if exists public.strava_webhook_events;
drop table if exists public.strava_webhook_subscription;

-- 3) La contrainte sur runs.source n'accepte plus 'strava' comme valeur
--    valide, pour empêcher toute réintroduction accidentelle.
alter table public.runs drop constraint if exists runs_source_check;
alter table public.runs add constraint runs_source_check
  check (source = any (array['garmin', 'coros', 'suunto', 'manual']));
