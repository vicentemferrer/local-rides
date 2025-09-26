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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bus_stops: {
        Row: {
          bus_id: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number
        }
        Insert: {
          bus_id?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude: number
        }
        Update: {
          bus_id?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number
        }
        Relationships: []
      }
      Buses: {
        Row: {
          bus_capacity: number | null
          created_at: string
          driver_id: string | null
          id: number
          plate_number: string | null
        }
        Insert: {
          bus_capacity?: number | null
          created_at?: string
          driver_id?: string | null
          id?: number
          plate_number?: string | null
        }
        Update: {
          bus_capacity?: number | null
          created_at?: string
          driver_id?: string | null
          id?: number
          plate_number?: string | null
        }
        Relationships: []
      }
      trip_stops: {
        Row: {
          arrival_time: string | null
          created_at: string
          depature_time: string | null
          google_place_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
          order_index: number | null
          trip_id: string | null
        }
        Insert: {
          arrival_time?: string | null
          created_at?: string
          depature_time?: string | null
          google_place_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          order_index?: number | null
          trip_id?: string | null
        }
        Update: {
          arrival_time?: string | null
          created_at?: string
          depature_time?: string | null
          google_place_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          order_index?: number | null
          trip_id?: string | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          bus_id: string | null
          created_at: string
          driver_id: string | null
          end_time: string | null
          id: string
          start_time: string | null
        }
        Insert: {
          bus_id?: string | null
          created_at?: string
          driver_id?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
        }
        Update: {
          bus_id?: string | null
          created_at?: string
          driver_id?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
        }
        Relationships: []
      }
      Users: {
        Row: {
          created_at: string
          fare: number | null
          id: number
          username: string | null
          vehicle: string | null
        }
        Insert: {
          created_at?: string
          fare?: number | null
          id?: number
          username?: string | null
          vehicle?: string | null
        }
        Update: {
          created_at?: string
          fare?: number | null
          id?: number
          username?: string | null
          vehicle?: string | null
        }
        Relationships: []
      }
      drivers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone_number: string
          user_type: string
          password_hash: string | null
          profile_picture: string | null
          is_active: boolean
          email_verified: boolean
          phone_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone_number: string
          user_type?: string
          password_hash?: string | null
          profile_picture?: string | null
          is_active?: boolean
          email_verified?: boolean
          phone_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone_number?: string
          user_type?: string
          password_hash?: string | null
          profile_picture?: string | null
          is_active?: boolean
          email_verified?: boolean
          phone_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_plates_user_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "drivers_plates"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vehicles_driver_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "driver_documents_driver_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "driver_documents"
            referencedColumns: ["driver_id"]
          }
        ]
      }
      drivers_plates: {
        Row: {
          user_id: string
          license_number: string
          license_expiry: string
          license_state: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          license_number: string
          license_expiry: string
          license_state: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          license_number?: string
          license_expiry?: string
          license_state?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_plates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          }
        ]
      }
      vehicles: {
        Row: {
          id: string
          driver_id: string
          make: string
          model: string
          year: string
          color: string
          license_plate: string
          vehicle_type: string
          seating_capacity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          driver_id: string
          make: string
          model: string
          year: string
          color: string
          license_plate: string
          vehicle_type?: string
          seating_capacity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          driver_id?: string
          make?: string
          model?: string
          year?: string
          color?: string
          license_plate?: string
          vehicle_type?: string
          seating_capacity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          }
        ]
      }
      driver_documents: {
        Row: {
          driver_id: string
          license_status: string
          insurance_status: string
          registration_status: string
          license_url: string | null
          insurance_url: string | null
          registration_url: string | null
          uploaded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          driver_id: string
          license_status?: string
          insurance_status?: string
          registration_status?: string
          license_url?: string | null
          insurance_url?: string | null
          registration_url?: string | null
          uploaded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          driver_id?: string
          license_status?: string
          insurance_status?: string
          registration_status?: string
          license_url?: string | null
          insurance_url?: string | null
          registration_url?: string | null
          uploaded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
