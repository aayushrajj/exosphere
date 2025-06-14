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
      calendarevents: {
        Row: {
          attendees: string[]
          end_time: string
          id: number
          start_time: string
          title: string
        }
        Insert: {
          attendees: string[]
          end_time: string
          id?: never
          start_time: string
          title: string
        }
        Update: {
          attendees?: string[]
          end_time?: string
          id?: never
          start_time?: string
          title?: string
        }
        Relationships: []
      }
      chatlogs: {
        Row: {
          ai_response: string
          id: number
          question: string
          session_id: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          ai_response: string
          id?: never
          question: string
          session_id?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          ai_response?: string
          id?: never
          question?: string
          session_id?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      deliveryissues: {
        Row: {
          id: number
          issue_description: string
          region: string
          reported_date: string
        }
        Insert: {
          id?: never
          issue_description: string
          region: string
          reported_date: string
        }
        Update: {
          id?: never
          issue_description?: string
          region?: string
          reported_date?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      metrics: {
        Row: {
          department_id: number
          id: number
          name: string
        }
        Insert: {
          department_id: number
          id?: never
          name: string
        }
        Update: {
          department_id?: number
          id?: never
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "metrics_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_audit_log: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          id: string
          new_ceo_id: string | null
          old_ceo_id: string | null
          organization_id: string | null
          triggered_by_user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          id?: string
          new_ceo_id?: string | null
          old_ceo_id?: string | null
          organization_id?: string | null
          triggered_by_user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          new_ceo_id?: string | null
          old_ceo_id?: string | null
          organization_id?: string | null
          triggered_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_organization_audit_log_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_audit_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          description: string
          domain: string | null
          founding_year: number | null
          id: string
          name: string
          org_code: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          domain?: string | null
          founding_year?: number | null
          id?: string
          name: string
          org_code?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          domain?: string | null
          founding_year?: number | null
          id?: string
          name?: string
          org_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sentemails: {
        Row: {
          department: string
          draft: string
          id: number
          metric: string
          sent_at: string
        }
        Insert: {
          department: string
          draft: string
          id?: never
          metric: string
          sent_at?: string
        }
        Update: {
          department?: string
          draft?: string
          id?: never
          metric?: string
          sent_at?: string
        }
        Relationships: []
      }
      user_organizations: {
        Row: {
          created_at: string | null
          executive_role: string
          id: string
          organization_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          executive_role: string
          id?: string
          organization_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          executive_role?: string
          id?: string
          organization_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_organizations_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_organizations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_organization: {
        Args: { org_id: string }
        Returns: undefined
      }
      delete_user_data: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      get_next_ceo_candidate: {
        Args: { org_id: string }
        Returns: string
      }
      get_recent_organization_changes: {
        Args: { org_id: string; since_timestamp?: string }
        Returns: {
          id: string
          action_type: string
          old_ceo_id: string
          new_ceo_id: string
          details: Json
          created_at: string
        }[]
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
