import { TestBed } from '@angular/core/testing';

import { HEREMapService } from './here-map.service';

describe('HEREMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HEREMapService = TestBed.get(HEREMapService);
    expect(service).toBeTruthy();
  });
});
