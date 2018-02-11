import { TestBed, inject } from '@angular/core/testing';

import { DecisiontreeService } from './decisiontree.service';

describe('DecisiontreeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DecisiontreeService]
    });
  });

  it('should be created', inject([DecisiontreeService], (service: DecisiontreeService) => {
    expect(service).toBeTruthy();
  }));
});
