export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          image_url: string | null
          category: string | null
          tags: string[] | null
          author: string | null
          published_at: string | null
          source_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['articles']['Insert']>
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type Article = Database['public']['Tables']['articles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
