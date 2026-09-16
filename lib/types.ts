export type Profile = {
  id: string
  full_name: string
  community_slug: string
  role: 'contributor' | 'admin'
  created_at: string
}

export type DictionaryEntry = {
  id: number
  community_slug: string
  word_devanagari: string
  word_sirijanga?: string
  romanized: string
  part_of_speech?: string
  dialect_origin: string
  meaning_nepali: string
  meaning_english: string
  example_sentence_wambule?: string
  example_sentence_nepali?: string
  audio_path?: string
  is_verified: boolean
  created_at: string
}

export type MediaItem = {
  id: number
  community_slug: string
  title: string
  category: 'music' | 'story' | 'heritage_photo'
  description?: string
  media_path: string
  transcript?: string
  district_origin?: string
  status: 'pending' | 'approved' | 'rejected'
  user_id?: string
  created_at: string
}
