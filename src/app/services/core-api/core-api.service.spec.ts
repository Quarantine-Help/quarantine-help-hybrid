import { TestBed } from '@angular/core/testing';

import { CoreAPIService } from './core-api.service';

describe('CoreAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoreAPIService = TestBed.get(CoreAPIService);
    expect(service).toBeTruthy();
  });
});
