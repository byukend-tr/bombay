import { TestBed, inject } from '@angular/core/testing';

import { MutationDetectionService } from './mutation-detection.service';

describe('MutationDetectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MutationDetectionService]
    });
  });

  it('should be created', inject([MutationDetectionService], (service: MutationDetectionService) => {
    expect(service).toBeTruthy();
  }));
});
