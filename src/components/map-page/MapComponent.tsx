'use client'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { useTheme } from '@/hooks/useTheme'

export default function MapComponent() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [locations, setLocations] = useState<SpeciesLocation[]>([])
  const markerRadius = 12

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('/api/species-map?limit=500', { cache: 'no-store' })
        const json = await resp.json()
        if (Array.isArray(json?.data)) {
          const list: SpeciesLocation[] = json.data
          setLocations(list)
        }
      } catch (e) {
        console.error('Failed to load species map', e)
      }
    })()
  }, [])

  const speciesColors = useMemo(() => {
    const uniqueSpecies = Array.from(new Set(locations.map(x => x.species)))
    const colorMap: Record<string, string> = {}
    uniqueSpecies.forEach(species => {
      colorMap[species] = colorFromString(species)
    })
    return colorMap
  }, [locations])

  function colorFromString(input: string): string {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash)
      hash |= 0
    }
    const hue = Math.abs(hash) % 360
    return `hsl(${hue} 70% 50%)`
  }

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
          className="h-[600px] lg:h-[800px] z-10 w-full rounded-lg"
          style={{ background: mapBackground }}
        >
          <TileLayer
            url={tileLayerUrl}
          />
          {locations.map((location) => (
            <CircleMarker
              key={`${location.device_id}-${location.species}`}
              center={[location.lat, location.lng]}
              radius={markerRadius}
              fillColor={speciesColors[location.species] ?? '#888'}
              color={speciesColors[location.species] ?? '#888'}
              weight={2}
              opacity={0.8}
              fillOpacity={0.7}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-lg">{location.species}</h3>
                  <p className="text-sm text-gray-600">{t('map.pondId')}: {location.device_id}</p>
                  <p className="text-sm text-gray-600">{location.city}</p>
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

interface SpeciesLocation {
  device_id: string
  species: string
  city: string
  lat: number
  lng: number
}
