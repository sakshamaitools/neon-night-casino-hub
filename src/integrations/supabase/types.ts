export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      game_seeds: {
        Row: {
          client_seed: string
          created_at: string | null
          game_session_id: string
          id: string
          is_revealed: boolean | null
          nonce: number | null
          server_seed: string
          server_seed_hash: string
          user_id: string
        }
        Insert: {
          client_seed: string
          created_at?: string | null
          game_session_id: string
          id?: string
          is_revealed?: boolean | null
          nonce?: number | null
          server_seed: string
          server_seed_hash: string
          user_id: string
        }
        Update: {
          client_seed?: string
          created_at?: string | null
          game_session_id?: string
          id?: string
          is_revealed?: boolean | null
          nonce?: number | null
          server_seed?: string
          server_seed_hash?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_seeds_game_session_id_fkey"
            columns: ["game_session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          game_type: string
          game_variant: string | null
          hands_played: number | null
          id: string
          is_active: boolean | null
          net_result: number | null
          session_data: Json | null
          session_end: string | null
          session_start: string | null
          total_bets: number | null
          total_wins: number | null
          user_id: string
        }
        Insert: {
          game_type: string
          game_variant?: string | null
          hands_played?: number | null
          id?: string
          is_active?: boolean | null
          net_result?: number | null
          session_data?: Json | null
          session_end?: string | null
          session_start?: string | null
          total_bets?: number | null
          total_wins?: number | null
          user_id: string
        }
        Update: {
          game_type?: string
          game_variant?: string | null
          hands_played?: number | null
          id?: string
          is_active?: boolean | null
          net_result?: number | null
          session_data?: Json | null
          session_end?: string | null
          session_start?: string | null
          total_bets?: number | null
          total_wins?: number | null
          user_id?: string
        }
        Relationships: []
      }
      game_statistics: {
        Row: {
          biggest_win: number | null
          created_at: string | null
          favorite_game_variant: string | null
          game_type: string
          id: string
          last_played: string | null
          longest_session: number | null
          total_bets: number | null
          total_sessions: number | null
          total_time_played: number | null
          total_wins: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          biggest_win?: number | null
          created_at?: string | null
          favorite_game_variant?: string | null
          game_type: string
          id?: string
          last_played?: string | null
          longest_session?: number | null
          total_bets?: number | null
          total_sessions?: number | null
          total_time_played?: number | null
          total_wins?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          biggest_win?: number | null
          created_at?: string | null
          favorite_game_variant?: string | null
          game_type?: string
          id?: string
          last_played?: string | null
          longest_session?: number | null
          total_bets?: number | null
          total_sessions?: number | null
          total_time_played?: number | null
          total_wins?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          first_name: string | null
          id: string
          kyc_documents: Json | null
          kyc_verified: boolean | null
          last_name: string | null
          updated_at: string | null
          username: string | null
          vip_level: number | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          id: string
          kyc_documents?: Json | null
          kyc_verified?: boolean | null
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
          vip_level?: number | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          kyc_documents?: Json | null
          kyc_verified?: boolean | null
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
          vip_level?: number | null
        }
        Relationships: []
      }
      self_exclusions: {
        Row: {
          created_at: string | null
          end_date: string | null
          exclusion_type: string
          id: string
          is_active: boolean | null
          reason: string | null
          start_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          exclusion_type: string
          id?: string
          is_active?: boolean | null
          reason?: string | null
          start_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          exclusion_type?: string
          id?: string
          is_active?: boolean | null
          reason?: string | null
          start_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          description: string | null
          game_session_id: string | null
          id: string
          status: string | null
          type: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          description?: string | null
          game_session_id?: string | null
          id?: string
          status?: string | null
          type: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          description?: string | null
          game_session_id?: string | null
          id?: string
          status?: string | null
          type?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_limits: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          limit_amount: number | null
          limit_duration: number | null
          limit_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          limit_amount?: number | null
          limit_duration?: number | null
          limit_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          limit_amount?: number | null
          limit_duration?: number | null
          limit_type?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number | null
          bonus_balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          bonus_balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          bonus_balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_wallet_balance: {
        Args: {
          p_user_id: string
          p_amount: number
          p_transaction_type: string
          p_description?: string
          p_game_session_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
