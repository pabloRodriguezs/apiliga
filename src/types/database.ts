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
      league_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      league_matches: {
        Row: {
          created_at: string | null
          id: string
          match_id: string
          played_at: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id: string
          played_at: string
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string
          played_at?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          created_at: string | null
          id: string
          puuid: string
          region: string
          summoner_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          puuid: string
          region: string
          summoner_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          puuid?: string
          region?: string
          summoner_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
