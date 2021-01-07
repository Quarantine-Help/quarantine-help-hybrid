export type RequestTypes = 'G' | 'M' | 'O' | undefined;
export type Category = 'all' | 'medicine' | 'grocery' | 'other';
export interface SearchFilters {
  distance: number;
  categories: Category[];
}
export interface ReverseGeoResult {
  headers: {
    normalizedNames: any;
    lazyUpdate?: any;
  };
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  type: number;
  body: {
    Response: { MetaInfo: MetaInfo; View: View[] };
  };
}

interface View {
  _type: string;
  ViewId: number;
  Result: Result[];
}

interface Result {
  Relevance: number;
  Distance: number;
  Direction: number;
  MatchLevel: string;
  MatchQuality: MatchQuality;
  Location: Location;
}

interface Location {
  LocationId: string;
  LocationType: string;
  DisplayPosition: DisplayPosition;
  MapView: {
    TopLeft: DisplayPosition;
    BottomRight: DisplayPosition;
  };
  Address: {
    Label: string;
    Country: string;
    State: string;
    County: string;
    City: string;
    District: string;
    PostalCode: string;
    AdditionalData: AdditionalDatum[];
  };
  MapReference: {
    ReferenceId: string;
    MapId: string;
    MapVersion: string;
    MapReleaseDate: string;
    SideOfStreet: string;
    CountryId: string;
    StateId: string;
    CountyId: string;
    CityId: string;
    DistrictId: string;
  };
}

interface AdditionalDatum {
  value: string;
  key: string;
}

interface MatchQuality {
  Country: number;
  State: number;
  County: number;
  City: number;
  District: number;
  PostalCode: number;
}

interface MetaInfo {
  Timestamp: string;
  NextPageInformation: string;
}

interface DisplayPosition {
  Latitude: number;
  Longitude: number;
}
