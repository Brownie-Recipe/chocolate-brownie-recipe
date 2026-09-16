'use server'

import { createClient } from '@/lib/supabase/server'
import type { DictionaryEntry, MediaItem } from '@/lib/types'

export async function searchDictionary(query: string, dialect?: string) {
  const supabase = await createClient()

  let queryBuilder = supabase
    .from('dictionary')
    .select('*')
    .eq('community_slug', 'wambule')

  if (dialect && dialect !== 'all') {
    queryBuilder = queryBuilder.eq('dialect_origin', dialect)
  }

  if (query.trim()) {
    queryBuilder = queryBuilder.textSearch('fts_vector', query)
  }

  const { data, error } = await queryBuilder.limit(50)

  if (error) {
    console.error('Search error:', error)
    return []
  }

  return data as DictionaryEntry[]
}

export async function getMediaByCategory(
  category: 'music' | 'story' | 'heritage_photo'
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('media_hub')
    .select('*')
    .eq('community_slug', 'wambule')
    .eq('category', category)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Media fetch error:', error)
    return []
  }

  return data as MediaItem[]
}

export async function getAllApprovedMedia() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('media_hub')
    .select('*')
    .eq('community_slug', 'wambule')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Media fetch error:', error)
    return []
  }

  return data as MediaItem[]
}

export async function getDictionaryEntry(id: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('dictionary')
    .select('*')
    .eq('id', id)
    .eq('community_slug', 'wambule')
    .single()

  if (error) {
    console.error('Entry fetch error:', error)
    return null
  }

  return data as DictionaryEntry
}
