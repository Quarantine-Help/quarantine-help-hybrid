import { TestBed } from '@angular/core/testing';

import { GeoLocationService } from './geo-location.service';

describe('GeoLocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeoLocationService = TestBed.get(GeoLocationService);
    expect(service).toBeTruthy();
  });
});
