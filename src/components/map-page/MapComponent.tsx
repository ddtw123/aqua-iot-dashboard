'use client'
import { fishSpeciesData } from '@/data/fishSpeciesData'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { useTheme } from '@/hooks/useTheme'

const speciesColors: Record<string, string> = {
  'Big Head Carp': '#FF6B35',
  'Catfish': '#20B2AA',
  'Grass Carp': '#4A90E2',
  'Mullet': '#E74C3C',
  'Tilapia': '#9B59B6',
}

const speciesSizes: Record<string, number> = {
  'Big Head Carp': 20,
  'Catfish': 16,
  'Grass Carp': 18,
  'Mullet': 14,
  'Tilapia': 18,
}

export default function MapComponent() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === 'dark'
  const mapBackground = isDark ? '#1a1a1a' : '#ffffff'
  const tileLayerUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"

  return (
    <div className="relative w-full">
      <div className="mb-6">
        <h1 className="text-h3SM md:text-h2MD text-black dark:text-white mb-2">
          {t('map.title')}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row relative gap-3 bg-white dark:bg-dark_blue/60 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg">
        <MapContainer
          center={[3.1390, 101.6869]}
          zoom={6}
          className="h-[600px] z-10 w-full rounded-lg"
          style={{ background: mapBackground }}
        >
          <TileLayer
            url={tileLayerUrl}
          />
          
          {fishSpeciesData.map((location) => (
            <CircleMarker
              key={`${location.pond_id}-${location.species}`}
              center={[location.lat, location.lng]}
              radius={speciesSizes[location.species] || 16}
              fillColor={speciesColors[location.species] || '#666'}
              color={speciesColors[location.species] || '#666'}
              weight={2}
              opacity={0.8}
              fillOpacity={0.7}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-lg">{location.species}</h3>
                  <p className="text-sm text-gray-600">{t('map.pondId')}: {location.pond_id}</p>
                  <p className="text-sm text-gray-600">{location.city}, {location.country}</p>
                  <p className="text-sm text-gray-600">
                    {t('map.coordinates')}: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        <div className="z-10 bg-white/95 dark:bg-dark_blue/95">
          <h3 className="font-semibold text-black dark:text-white mb-3">{t('map.species')}</h3>
          <div className="space-y-2">
            {Object.entries(speciesColors).map(([species, color]) => (
              <div key={species} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: color }}
                />
                <span className="text-h5SM md:text-h5MD text-black dark:text-white">{species}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
