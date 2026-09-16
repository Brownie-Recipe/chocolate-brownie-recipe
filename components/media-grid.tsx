'use client'

import { useState, useEffect } from 'react'
import { getAllApprovedMedia } from '@/lib/queries'
import type { MediaItem } from '@/lib/types'
import MediaCard from './media-card'

const CATEGORIES = [
  { value: 'all', label: '✨ All' },
  { value: 'music', label: '🎵 Music' },
  { value: 'story', label: '📖 Stories' },
  { value: 'heritage_photo', label: '📸 Heritage' },
]

export default function MediaGrid() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMedia = async () => {
      setIsLoading(true)
      const data = await getAllApprovedMedia()
      setItems(data)
      setFilteredItems(data)
      setIsLoading(false)
    }

    loadMedia()
  }, [])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === 'all') {
      setFilteredItems(items)
    } else {
      setFilteredItems(items.filter((item) => item.category === category))
    }
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Heritage Media Archive</h2>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading media...</p>
        </div>
      )}

      {!isLoading && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!isLoading && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No media found in this category yet.</p>
          <p className="text-sm text-gray-500 mt-2">Check back soon!</p>
        </div>
      )}
    </div>
  )
}
