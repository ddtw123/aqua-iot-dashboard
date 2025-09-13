export interface FishSpecies {
  pond_id: string
  country: string
  city: string
  lat: number
  lng: number
  species: string
}

export interface SpeciesLocation {
  device_id: string
  species: string
  city: string
  lat: number
  lng: number
  updated_at?: string
  version?: number
}
