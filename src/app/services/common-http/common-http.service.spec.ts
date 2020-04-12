import { TestBed } from '@angular/core/testing';

import { CommonHTTPService } from './common-http.service';

describe('CommonHTTPService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonHTTPService = TestBed.get(CommonHTTPService);
    expect(service).toBeTruthy();
  });
});
