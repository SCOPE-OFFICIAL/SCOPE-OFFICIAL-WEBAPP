/**
 * Database Type Definitions
 * These match the Supabase tables we'll create
 */

export interface Event {
  id: string
  title: string
  description: string
  short_description: string
  event_date: string
  event_time: string | null
  location: string | null
  image_url: string | null
  registration_link: string | null
  event_type: 'workshop' | 'hackathon' | 'webinar' | 'competition' | 'meetup' | 'other'
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  image_url: string
  folder_name: string
  caption: string | null
  upload_date: string
  display_order: number
  is_visible: boolean
}

export interface TeamMember {
  id: string
  name: string
  role: string
  photo_url: string | null
  bio: string | null
  instagram_url: string | null
  linkedin_url: string | null
  github_url?: string | null
  personality?: string | null
  email: string | null
  year: string | null
  is_active: boolean
  display_order: number
  created_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string | null
  display_order: number
  is_visible: boolean
  created_at: string
}

// Group Photos
export interface GroupPhoto {
  id: string  // UUID
  title: string
  description?: string
  image_url: string
  category: string
  upload_date: string
  is_visible: boolean
  display_order: number
  tags?: PhotoTag[]
}

// Photo Tags
export interface PhotoTag {
  id: string  // UUID
  photo_id: string  // UUID
  team_member_id?: string  // UUID
  person_name: string
  position_x: number // percentage 0-100
  position_y: number // percentage 0-100
  created_at: string
}

// User Questions
export interface UserQuestion {
  id: string  // UUID
  user_name: string
  user_email?: string
  question: string
  answer?: string
  category?: string
  status: 'pending' | 'answered' | 'archived'
  is_public: boolean
  submitted_at: string
  answered_at?: string
  answered_by?: string
}

// Form types for creating/updating
export type EventFormData = Omit<Event, 'id' | 'created_at' | 'updated_at'>
export type GalleryImageFormData = Omit<GalleryImage, 'id' | 'upload_date'>
export type TeamMemberFormData = Omit<TeamMember, 'id' | 'created_at'>
export type FAQFormData = Omit<FAQ, 'id' | 'created_at'>
export type GroupPhotoFormData = Omit<GroupPhoto, 'id' | 'upload_date' | 'tags'>
export type PhotoTagFormData = Omit<PhotoTag, 'id' | 'created_at'>
export type UserQuestionFormData = Pick<UserQuestion, 'user_name' | 'user_email' | 'question' | 'category'>

