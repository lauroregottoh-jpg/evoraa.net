export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string | null
          id: string
          match_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          compatibility_score: number | null
          created_at: string | null
          id: string
          status: string | null
          user_one: string
          user_two: string
        }
        Insert: {
          compatibility_score?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          user_one: string
          user_two: string
        }
        Update: {
          compatibility_score?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          user_one?: string
          user_two?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          sender_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          sender_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          id: string
          is_read: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          metadata: Json | null
          provider: string | null
          status: string | null
          subscription_id: string
          transaction_reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency: string
          id?: string
          metadata?: Json | null
          provider?: string | null
          status?: string | null
          subscription_id: string
          transaction_reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          provider?: string | null
          status?: string | null
          subscription_id?: string
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          attendance_frequency:
            | Database["public"]["Enums"]["attendance_frequency_enum"]
            | null
          avatar_url: string | null
          biography: string | null
          birth_date: string | null
          character_traits: string[] | null
          church_attended: string | null
          city: string | null
          completion_percentage: number | null
          conversion_year: number | null
          core_values: string[] | null
          country: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          denomination: string | null
          education_level:
            | Database["public"]["Enums"]["education_level_enum"]
            | null
          email_verified: boolean | null
          faith_importance: string | null
          first_name: string | null
          gender: string | null
          hobbies: string[] | null
          id: string
          identity_verified: boolean | null
          interests: string[] | null
          is_verified: boolean | null
          languages: string[] | null
          last_name: string | null
          marital_status:
            | Database["public"]["Enums"]["marital_status_enum"]
            | null
          matching_indicators: Json | null
          ministry_engagement: string | null
          moderation_rejection_reason: string | null
          moderation_status:
            | Database["public"]["Enums"]["moderation_status_enum"]
            | null
          onboarding_status:
            | Database["public"]["Enums"]["onboarding_status_enum"]
            | null
          passions: string[] | null
          phone_verified: boolean | null
          privacy_settings: Json | null
          profession: string | null
          psychometric_results: Json | null
          testimony: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          attendance_frequency?:
            | Database["public"]["Enums"]["attendance_frequency_enum"]
            | null
          avatar_url?: string | null
          biography?: string | null
          birth_date?: string | null
          character_traits?: string[] | null
          church_attended?: string | null
          city?: string | null
          completion_percentage?: number | null
          conversion_year?: number | null
          core_values?: string[] | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          denomination?: string | null
          education_level?:
            | Database["public"]["Enums"]["education_level_enum"]
            | null
          email_verified?: boolean | null
          faith_importance?: string | null
          first_name?: string | null
          gender?: string | null
          hobbies?: string[] | null
          id?: string
          identity_verified?: boolean | null
          interests?: string[] | null
          is_verified?: boolean | null
          languages?: string[] | null
          last_name?: string | null
          marital_status?:
            | Database["public"]["Enums"]["marital_status_enum"]
            | null
          matching_indicators?: Json | null
          ministry_engagement?: string | null
          moderation_rejection_reason?: string | null
          moderation_status?:
            | Database["public"]["Enums"]["moderation_status_enum"]
            | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status_enum"]
            | null
          passions?: string[] | null
          phone_verified?: boolean | null
          privacy_settings?: Json | null
          profession?: string | null
          psychometric_results?: Json | null
          testimony?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          attendance_frequency?:
            | Database["public"]["Enums"]["attendance_frequency_enum"]
            | null
          avatar_url?: string | null
          biography?: string | null
          birth_date?: string | null
          character_traits?: string[] | null
          church_attended?: string | null
          city?: string | null
          completion_percentage?: number | null
          conversion_year?: number | null
          core_values?: string[] | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          denomination?: string | null
          education_level?:
            | Database["public"]["Enums"]["education_level_enum"]
            | null
          email_verified?: boolean | null
          faith_importance?: string | null
          first_name?: string | null
          gender?: string | null
          hobbies?: string[] | null
          id?: string
          identity_verified?: boolean | null
          interests?: string[] | null
          is_verified?: boolean | null
          languages?: string[] | null
          last_name?: string | null
          marital_status?:
            | Database["public"]["Enums"]["marital_status_enum"]
            | null
          matching_indicators?: Json | null
          ministry_engagement?: string | null
          moderation_rejection_reason?: string | null
          moderation_status?:
            | Database["public"]["Enums"]["moderation_status_enum"]
            | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status_enum"]
            | null
          passions?: string[] | null
          phone_verified?: boolean | null
          privacy_settings?: Json | null
          profession?: string | null
          psychometric_results?: Json | null
          testimony?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      psychometric_tests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          version: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          version: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          version?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          id: string
          reason: string
          reported_user_id: string
          reporter_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason: string
          reported_user_id: string
          reporter_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string
          reported_user_id?: string
          reporter_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          ends_at: string | null
          id: string
          plan: string
          starts_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          plan: string
          starts_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          plan?: string
          starts_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      test_answers: {
        Row: {
          answer_value: number
          created_at: string | null
          id: string
          question_id: string
          user_id: string
        }
        Insert: {
          answer_value: number
          created_at?: string | null
          id?: string
          question_id: string
          user_id: string
        }
        Update: {
          answer_value?: number
          created_at?: string | null
          id?: string
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "test_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_questions: {
        Row: {
          created_at: string | null
          id: string
          order_index: number
          question: string
          test_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_index: number
          question: string
          test_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_index?: number
          question?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "psychometric_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          completed_at: string | null
          dimensions: Json | null
          id: string
          profile_code: string | null
          score: number | null
          test_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          dimensions?: Json | null
          id?: string
          profile_code?: string | null
          score?: number | null
          test_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          dimensions?: Json | null
          id?: string
          profile_code?: string | null
          score?: number | null
          test_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "psychometric_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_gamification: {
        Row: {
          badges: string[] | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          profile_quality_score: number | null
          rewards: Json | null
          trust_level: number | null
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          badges?: string[] | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          profile_quality_score?: number | null
          rewards?: Json | null
          trust_level?: number | null
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          badges?: string[] | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          profile_quality_score?: number | null
          rewards?: Json | null
          trust_level?: number | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_photos: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          display_order: number | null
          id: string
          is_primary: boolean | null
          photo_url: string
          profile_id: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["photo_status_enum"] | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          photo_url: string
          profile_id: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["photo_status_enum"] | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          photo_url?: string
          profile_id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["photo_status_enum"] | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_photos_user_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          accepted_countries: string[] | null
          age_max: number | null
          age_min: number | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          desire_children: string | null
          important_criteria: string[] | null
          life_project: string | null
          max_distance: number | null
          updated_at: string
          updated_by: string | null
          user_id: string
          vision_of_marriage: string | null
        }
        Insert: {
          accepted_countries?: string[] | null
          age_max?: number | null
          age_min?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          desire_children?: string | null
          important_criteria?: string[] | null
          life_project?: string | null
          max_distance?: number | null
          updated_at?: string
          updated_by?: string | null
          user_id: string
          vision_of_marriage?: string | null
        }
        Update: {
          accepted_countries?: string[] | null
          age_max?: number | null
          age_min?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          desire_children?: string | null
          important_criteria?: string[] | null
          life_project?: string | null
          max_distance?: number | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string
          vision_of_marriage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      attendance_frequency_enum:
        | "weekly"
        | "monthly"
        | "occasionally"
        | "rarely"
      education_level_enum:
        | "high_school"
        | "bachelors"
        | "masters"
        | "doctorate"
        | "other"
      marital_status_enum: "single" | "divorced" | "widowed" | "annulled"
      moderation_status_enum: "pending" | "approved" | "rejected"
      onboarding_status_enum:
        | "step1_account"
        | "step2_profile"
        | "step3_tests"
        | "pending_review"
        | "active"
        | "banned"
      photo_status_enum: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attendance_frequency_enum: [
        "weekly",
        "monthly",
        "occasionally",
        "rarely",
      ],
      education_level_enum: [
        "high_school",
        "bachelors",
        "masters",
        "doctorate",
        "other",
      ],
      marital_status_enum: ["single", "divorced", "widowed", "annulled"],
      moderation_status_enum: ["pending", "approved", "rejected"],
      onboarding_status_enum: [
        "step1_account",
        "step2_profile",
        "step3_tests",
        "pending_review",
        "active",
        "banned",
      ],
      photo_status_enum: ["pending", "approved", "rejected"],
    },
  },
} as const
