import type { MediaItem } from '@/lib/types'

const CATEGORY_LABELS = {
  music: '🎵 Music',
  story: '📖 Story',
  heritage_photo: '📸 Heritage',
}

export default function MediaCard({ item }: { item: MediaItem }) {
  const categoryLabel = CATEGORY_LABELS[item.category]
  const isImage = item.media_path?.match(/\.(jpg|jpeg|png|webp)$/i)
  const isAudio = item.media_path?.match(/\.(mp3|wav|ogg)$/i)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {isImage && (
        <div className="aspect-video bg-gray-200 overflow-hidden">
          <img
            src={item.media_path}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {isAudio && (
        <div className="aspect-video bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
          <div className="text-4xl">🎵</div>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded">
            {categoryLabel}
          </span>
          {item.district_origin && (
            <span className="text-xs text-gray-600">{item.district_origin}</span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>

        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-3 flex-1">{item.description}</p>
        )}

        {isAudio && (
          <div className="mt-4">
            <audio
              controls
              className="w-full h-8"
              src={item.media_path}
              preload="none"
            >
              Your browser does not support audio playback.
            </audio>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
          Added {new Date(item.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}
