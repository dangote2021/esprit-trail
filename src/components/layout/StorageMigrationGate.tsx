"use client";

// Gate client qui rename les keys localStorage ravito_* → esprit_* au boot.
// Idempotent. Rendu null, n'affiche rien.

import { useEffect } from "react";
import { migrateRavitoStorage } from "@/lib/storage-migration";

export default function StorageMigrationGate() {
  useEffect(() => {
    migrateRavitoStorage();
  }, []);
  return null;
}
