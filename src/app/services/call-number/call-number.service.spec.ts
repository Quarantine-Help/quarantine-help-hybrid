import { TestBed } from '@angular/core/testing';

import { CallNumberService } from './call-number.service';

describe('CallNumberService', () => {
  let service: CallNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
