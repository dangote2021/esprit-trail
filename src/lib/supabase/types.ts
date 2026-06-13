// ====== TYPES SUPABASE ======
// Régénérer via : npx supabase gen types typescript --project-id kymhcdxcyrpwyxbtgrdt
// (project "ravito" / Esprit Trail)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      badges: {
        Row: {
          category: string;
          description: string;
          global_unlock_rate: number;
          icon: string;
          id: string;
          name: string;
          rarity: string;
          xp_reward: number;
        };
        Insert: {
          category: string;
          description: string;
          global_unlock_rate?: number;
          icon: string;
          id: string;
          name: string;
          rarity: string;
          xp_reward?: number;
        };
        Update: Partial<Database["public"]["Tables"]["badges"]["Insert"]>;
      };
      coach_plans: {
        Row: {
          created_at: string;
          current_week: number;
          goal: string;
          id: string;
          plan_data: Json;
          status: string;
          target_date: string | null;
          total_weeks: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_week?: number;
          goal: string;
          id?: string;
          plan_data: Json;
          status?: string;
          target_date?: string | null;
          total_weeks: number;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["coach_plans"]["Insert"]>;
      };
      conversation_members: {
        Row: {
          conversation_id: string;
          joined_at: string | null;
          last_read_at: string | null;
          muted: boolean | null;
          role: string;
          user_id: string;
        };
        Insert: {
          conversation_id: string;
          joined_at?: string | null;
          last_read_at?: string | null;
          muted?: boolean | null;
          role?: string;
          user_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["conversation_members"]["Insert"]
        >;
      };
      conversations: {
        Row: {
          avatar: string | null;
          created_at: string | null;
          created_by: string;
          description: string | null;
          id: string;
          last_message_at: string | null;
          last_message_author_id: string | null;
          last_message_preview: string | null;
          name: string | null;
          type: string;
        };
        Insert: {
          avatar?: string | null;
          created_at?: string | null;
          created_by: string;
          description?: string | null;
          id?: string;
          last_message_at?: string | null;
          last_message_author_id?: string | null;
          last_message_preview?: string | null;
          name?: string | null;
          type: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["conversations"]["Insert"]
        >;
      };
      guilde_members: {
        Row: {
          guilde_id: string;
          joined_at: string;
          role: string;
          user_id: string;
        };
        Insert: {
          guilde_id: string;
          joined_at?: string;
          role?: string;
          user_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["guilde_members"]["Insert"]
        >;
      };
      guildes: {
        Row: {
          captain_id: string;
          category: string | null;
          created_at: string;
          description: string | null;
          emoji: string;
          id: string;
          join_rule: string;
          location: string | null;
          max_members: number;
          name: string;
          tagline: string | null;
          vibe: string[];
        };
        Insert: {
          captain_id: string;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          emoji?: string;
          id?: string;
          join_rule?: string;
          location?: string | null;
          max_members?: number;
          name: string;
          tagline?: string | null;
          vibe?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["guildes"]["Insert"]>;
      };
      messages: {
        Row: {
          attachment: Json | null;
          author_id: string;
          conversation_id: string;
          created_at: string | null;
          deleted_at: string | null;
          edited_at: string | null;
          id: string;
          text: string;
        };
        Insert: {
          attachment?: Json | null;
          author_id: string;
          conversation_id: string;
          created_at?: string | null;
          deleted_at?: string | null;
          edited_at?: string | null;
          id?: string;
          text: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      profiles: {
        Row: {
          avatar: string | null;
          display_name: string;
          id: string;
          itra_level: number | null;
          itra_performance_index: number | null;
          joined_at: string;
          loot_style: string;
          mode: string;
          streak: number;
          updated_at: string;
          username: string;
          utmb_category_index: Json | null;
          utmb_index: number | null;
          watches: string[];
          weekly_progress: number;
          weekly_target: number;
          xp: number;
        };
        Insert: {
          avatar?: string | null;
          display_name: string;
          id: string;
          itra_level?: number | null;
          itra_performance_index?: number | null;
          joined_at?: string;
          loot_style?: string;
          mode?: string;
          streak?: number;
          updated_at?: string;
          username: string;
          utmb_category_index?: Json | null;
          utmb_index?: number | null;
          watches?: string[];
          weekly_progress?: number;
          weekly_target?: number;
          xp?: number;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      quest_definitions: {
        Row: {
          active: boolean;
          description: string;
          icon: string | null;
          id: string;
          period: string;
          target: number;
          title: string;
          unit: string;
          xp_reward: number;
        };
        Insert: {
          active?: boolean;
          description: string;
          icon?: string | null;
          id: string;
          period: string;
          target: number;
          title: string;
          unit: string;
          xp_reward?: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["quest_definitions"]["Insert"]
        >;
      };
      runs: {
        Row: {
          avg_pace: string | null;
          created_at: string;
          date: string;
          distance: number;
          duration: number;
          elevation: number;
          external_id: string | null;
          id: string;
          location: string | null;
          polyline: string | null;
          source: string | null;
          terrain: string | null;
          title: string;
          user_id: string;
          xp_earned: number;
        };
        Insert: {
          avg_pace?: string | null;
          created_at?: string;
          date: string;
          distance: number;
          duration: number;
          elevation?: number;
          external_id?: string | null;
          id?: string;
          location?: string | null;
          polyline?: string | null;
          source?: string | null;
          terrain?: string | null;
          title: string;
          user_id: string;
          xp_earned?: number;
        };
        Update: Partial<Database["public"]["Tables"]["runs"]["Insert"]>;
      };
      user_badges: {
        Row: {
          badge_id: string;
          run_id: string | null;
          unlocked_at: string;
          user_id: string;
        };
        Insert: {
          badge_id: string;
          run_id?: string | null;
          unlocked_at?: string;
          user_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_badges"]["Insert"]
        >;
      };
      user_integrations: {
        Row: {
          access_token: string;
          connected_at: string;
          expires_at: string | null;
          external_user_id: string | null;
          last_sync_at: string | null;
          provider: string;
          raw: Json | null;
          refresh_token: string | null;
          scope: string | null;
          user_id: string;
        };
        Insert: {
          access_token: string;
          connected_at?: string;
          expires_at?: string | null;
          external_user_id?: string | null;
          last_sync_at?: string | null;
          provider: string;
          raw?: Json | null;
          refresh_token?: string | null;
          scope?: string | null;
          user_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_integrations"]["Insert"]
        >;
      };
      user_off_races: {
        Row: {
          category: string;
          country: string;
          cover: string | null;
          created_at: string | null;
          distance: number;
          elevation: number;
          id: string;
          location: string;
          name: string;
          record_holder: string | null;
          record_time: string | null;
          soul: string | null;
          status: string;
          submitter_id: string;
          tagline: string;
          vibe: string;
        };
        Insert: {
          category: string;
          country?: string;
          cover?: string | null;
          created_at?: string | null;
          distance: number;
          elevation: number;
          id?: string;
          location: string;
          name: string;
          record_holder?: string | null;
          record_time?: string | null;
          soul?: string | null;
          status?: string;
          submitter_id: string;
          tagline: string;
          vibe: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_off_races"]["Insert"]
        >;
      };
      user_quests: {
        Row: {
          completed_at: string | null;
          created_at: string;
          expires_at: string;
          progress: number;
          quest_id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          expires_at: string;
          progress?: number;
          quest_id: string;
          user_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_quests"]["Insert"]
        >;
      };
      user_races: {
        Row: {
          category: string;
          country: string;
          created_at: string | null;
          date: string;
          difficulty: number;
          distance: number;
          elevation: number;
          hero_image: string | null;
          id: string;
          itra_points: number | null;
          location: string;
          name: string;
          official_url: string | null;
          status: string;
          submitter_id: string;
          tagline: string;
        };
        Insert: {
          category: string;
          country?: string;
          created_at?: string | null;
          date: string;
          difficulty: number;
          distance: number;
          elevation: number;
          hero_image?: string | null;
          id?: string;
          itra_points?: number | null;
          location: string;
          name: string;
          official_url?: string | null;
          status?: string;
          submitter_id: string;
          tagline: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_races"]["Insert"]>;
      };
      user_wishlist_races: {
        Row: {
          added_at: string | null;
          race_id: string;
          user_id: string;
        };
        Insert: {
          added_at?: string | null;
          race_id: string;
          user_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_wishlist_races"]["Insert"]
        >;
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_conversation: {
        Args: {
          p_avatar: string | null;
          p_description: string | null;
          p_member_ids: string[];
          p_name: string | null;
          p_type: string;
        };
        Returns: string;
      };
      unread_count_for_user: {
        Args: Record<string, never>;
        Returns: number;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
