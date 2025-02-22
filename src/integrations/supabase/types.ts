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
      dog_parks: {
        Row: {
          business_status: string | null
          city: string | null
          country: string | null
          full_address: string
          id: string
          location_link: string | null
          name: string
          phone: string | null
          photo: string | null
          postal_code: string | null
          reviews: number | null
          site: string | null
          state: string | null
          street: string | null
          street_view: string | null
          working_hours: Json | null
        }
        Insert: {
          business_status?: string | null
          city?: string | null
          country?: string | null
          full_address: string
          id?: string
          location_link?: string | null
          name: string
          phone?: string | null
          photo?: string | null
          postal_code?: string | null
          reviews?: number | null
          site?: string | null
          state?: string | null
          street?: string | null
          street_view?: string | null
          working_hours?: Json | null
        }
        Update: {
          business_status?: string | null
          city?: string | null
          country?: string | null
          full_address?: string
          id?: string
          location_link?: string | null
          name?: string
          phone?: string | null
          photo?: string | null
          postal_code?: string | null
          reviews?: number | null
          site?: string | null
          state?: string | null
          street?: string | null
          street_view?: string | null
          working_hours?: Json | null
        }
        Relationships: []
      }
      enriched_dog_parks: {
        Row: {
          address: string | null
          amenities_score: number | null
          best_time_to_visit: number | null
          busiest_day: string | null
          busiest_hour: number | null
          city: string | null
          created_at: string
          features: string | null
          good_for_kids: boolean | null
          has_benches: boolean | null
          has_parking: boolean | null
          has_picnic_area: boolean | null
          has_restroom: boolean | null
          has_shade: boolean | null
          has_water: boolean | null
          hours_per_week: number | null
          id: number
          is_24_hours: boolean | null
          latitude: number | null
          longitude: number | null
          main_photo_url: string | null
          name: string
          off_leash_allowed: boolean | null
          operating_hours: Json | null
          phone: string | null
          positive_review_percentage: number | null
          rating: number | null
          review_confidence: number | null
          review_count: number | null
          state: string | null
          status: string | null
          street_view_url: string | null
          updated_at: string
          website: string | null
          wheelchair_accessible: boolean | null
        }
        Insert: {
          address?: string | null
          amenities_score?: number | null
          best_time_to_visit?: number | null
          busiest_day?: string | null
          busiest_hour?: number | null
          city?: string | null
          created_at?: string
          features?: string | null
          good_for_kids?: boolean | null
          has_benches?: boolean | null
          has_parking?: boolean | null
          has_picnic_area?: boolean | null
          has_restroom?: boolean | null
          has_shade?: boolean | null
          has_water?: boolean | null
          hours_per_week?: number | null
          id?: number
          is_24_hours?: boolean | null
          latitude?: number | null
          longitude?: number | null
          main_photo_url?: string | null
          name: string
          off_leash_allowed?: boolean | null
          operating_hours?: Json | null
          phone?: string | null
          positive_review_percentage?: number | null
          rating?: number | null
          review_confidence?: number | null
          review_count?: number | null
          state?: string | null
          status?: string | null
          street_view_url?: string | null
          updated_at?: string
          website?: string | null
          wheelchair_accessible?: boolean | null
        }
        Update: {
          address?: string | null
          amenities_score?: number | null
          best_time_to_visit?: number | null
          busiest_day?: string | null
          busiest_hour?: number | null
          city?: string | null
          created_at?: string
          features?: string | null
          good_for_kids?: boolean | null
          has_benches?: boolean | null
          has_parking?: boolean | null
          has_picnic_area?: boolean | null
          has_restroom?: boolean | null
          has_shade?: boolean | null
          has_water?: boolean | null
          hours_per_week?: number | null
          id?: number
          is_24_hours?: boolean | null
          latitude?: number | null
          longitude?: number | null
          main_photo_url?: string | null
          name?: string
          off_leash_allowed?: boolean | null
          operating_hours?: Json | null
          phone?: string | null
          positive_review_percentage?: number | null
          rating?: number | null
          review_confidence?: number | null
          review_count?: number | null
          state?: string | null
          status?: string | null
          street_view_url?: string | null
          updated_at?: string
          website?: string | null
          wheelchair_accessible?: boolean | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          dog_energy_level: string | null
          dog_sizes: string[] | null
          full_name: string | null
          id: string
          number_of_dogs: number | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          created_at?: string
          dog_energy_level?: string | null
          dog_sizes?: string[] | null
          full_name?: string | null
          id?: string
          number_of_dogs?: number | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          created_at?: string
          dog_energy_level?: string | null
          dog_sizes?: string[] | null
          full_name?: string | null
          id?: string
          number_of_dogs?: number | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
