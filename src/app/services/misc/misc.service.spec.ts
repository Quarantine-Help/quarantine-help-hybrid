import { TestBed } from '@angular/core/testing';

import { MiscService } from './misc.service';

describe('LoadingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MiscService = TestBed.get(MiscService);
    expect(service).toBeTruthy();
  });
});
