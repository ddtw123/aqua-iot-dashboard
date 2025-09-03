import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/map-page/MapComponent'), {
  ssr: false,
});

export default function MapPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <MapComponent />
    </div>
  );
}