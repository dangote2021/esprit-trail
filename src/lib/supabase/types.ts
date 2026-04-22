// ====== TYPES SUPABASE — à régénérer une fois le projet créé ======
//
// Pour régénérer les types depuis Supabase :
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
//
// En attendant, on maintient ce fichier à la main pour permettre au code d'être
// typé sans dépendre d'un projet Supabase live.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar: string | null;
          xp: number;
          weekly_target: number;
          weekly_progress: number;
          streak: number;
          mode: "adventure" | "performance";
          loot_style: "gamer" | "real" | "hidden";
          joined_at: string;
          updated_at: string;
          utmb_index: number | null;
          utmb_category_index: Record<string, number> | null;
          itra_performance_index: number | null;
          itra_level: number | null;
          watches: string[];
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar?: string | null;
          xp?: number;
          weekly_target?: number;
          weekly_progress?: number;
          streak?: number;
          mode?: "adventure" | "performance";
          loot_style?: "gamer" | "real" | "hidden";
          utmb_index?: number | null;
          itra_performance_index?: number | null;
          itra_level?: number | null;
          watches?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      runs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          title: string;
          location: string | null;
          distance: number;
          elevation: number;
          duration: number;
          avg_pace: string | null;
          terrain: string | null;
          source: string | null;
          external_id: string | null;
          xp_earned: number;
          polyline: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["runs"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["runs"]["Insert"]>;
      };
      guildes: {
        Row: {
          id: string;
          name: string;
          emoji: string;
          tagline: string | null;
          description: string | null;
          category: string | null;
          location: string | null;
          max_members: number;
          join_rule: "open" | "request" | "invite-only";
          captain_id: string;
          vibe: string[];
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["guildes"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["guildes"]["Insert"]>;
      };
      guilde_members: {
        Row: {
          guilde_id: string;
          user_id: string;
          role: "captain" | "member";
          joined_at: string;
        };
        Insert: Database["public"]["Tables"]["guilde_members"]["Row"];
        Update: Partial<Database["public"]["Tables"]["guilde_members"]["Row"]>;
      };
      coach_plans: {
        Row: {
          id: string;
          user_id: string;
          goal: string;
          target_date: string | null;
          total_weeks: number;
          plan_data: unknown;
          status: "active" | "paused" | "done" | "abandoned";
          current_week: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["coach_plans"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["coach_plans"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
