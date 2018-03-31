import { TestBed, inject } from '@angular/core/testing';

import { SharingdataService } from './sharingdata.service';

describe('SharingdataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharingdataService]
    });
  });

  it('should be created', inject([SharingdataService], (service: SharingdataService) => {
    expect(service).toBeTruthy();
  }));
});
