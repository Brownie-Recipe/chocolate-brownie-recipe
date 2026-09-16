'use client'

import { useState, useTransition } from 'react'
import { searchDictionary } from '@/lib/queries'
import type { DictionaryEntry } from '@/lib/types'

const DIALECTS = [
  { value: 'all', label: 'All Dialects' },
  { value: 'Standard', label: 'Standard' },
  { value: 'Wamdyal', label: 'Wamdyal' },
  { value: 'Hilepane', label: 'Hilepane' },
  { value: 'Udaipure', label: 'Udaipure' },
]

export default function DictionarySearch({
  onResultsChange,
}: {
  onResultsChange: (results: DictionaryEntry[]) => void
}) {
  const [query, setQuery] = useState('')
  const [dialect, setDialect] = useState('all')
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState<DictionaryEntry[]>([])

  const handleSearch = (searchQuery: string, selectedDialect: string) => {
    startTransition(async () => {
      const data = await searchDictionary(
        searchQuery,
        selectedDialect === 'all' ? undefined : selectedDialect
      )
      setResults(data)
      onResultsChange(data)
    })
  }

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    handleSearch(value, dialect)
  }

  const handleDialectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setDialect(value)
    handleSearch(query, value)
  }

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          Search Wambule Dictionary
        </label>
        <input
          id="search"
          type="text"
          placeholder="Enter word in Devanagari, Romanized, or English..."
          value={query}
          onChange={handleQueryChange}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="dialect" className="block text-sm font-medium text-gray-700">
          Dialect
        </label>
        <select
          id="dialect"
          value={dialect}
          onChange={handleDialectChange}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
        >
          {DIALECTS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {isPending && (
        <div className="text-center py-4">
          <p className="text-gray-600">Searching...</p>
        </div>
      )}

      {!isPending && results.length > 0 && (
        <div className="space-y-3 mt-6">
          <p className="text-sm text-gray-600">Found {results.length} results</p>
          {results.map((entry) => (
            <div
              key={entry.id}
              className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                {entry.word_devanagari && (
                  <div className="text-lg font-semibold text-gray-900">
                    {entry.word_devanagari}
                  </div>
                )}
                {entry.word_sirijanga && (
                  <div className="text-sm text-gray-600">Sirijanga: {entry.word_sirijanga}</div>
                )}
                <div className="text-sm text-gray-700">
                  <strong>Romanized:</strong> {entry.romanized}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>English:</strong> {entry.meaning_english}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Nepali:</strong> {entry.meaning_nepali}
                </div>
                {entry.example_sentence_wambule && (
                  <div className="text-sm text-gray-600 italic">
                    Example: {entry.example_sentence_wambule}
                  </div>
                )}
                {entry.audio_path && (
                  <div className="mt-2">
                    <audio
                      controls
                      className="w-full h-8"
                      src={entry.audio_path}
                      preload="none"
                    >
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Dialect: {entry.dialect_origin}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isPending && query && results.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No results found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-2">Try searching with different text</p>
        </div>
      )}
    </div>
  )
}
