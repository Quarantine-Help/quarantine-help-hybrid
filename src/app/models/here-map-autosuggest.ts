export interface AutoSuggestResultItem {
  title: string;
  id: string;
  resultType: string;
  address: Address;
  position: Position;
  distance: number;
  mapView: MapView;
  highlights: Highlights;
}

interface Highlights {
  title: Title[];
  address: Address2;
}

interface Address2 {
  label: Title[];
}

interface Title {
  start: number;
  end: number;
}

interface MapView {
  west: number;
  south: number;
  east: number;
  north: number;
}

interface Position {
  lat: number;
  lng: number;
}

interface Address {
  label: string;
}
