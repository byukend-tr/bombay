import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypeAntibodyFormComponent } from './phenotype-antibody-form.component';

describe('PhenotypeAntibodyFormComponent', () => {
  let component: PhenotypeAntibodyFormComponent;
  let fixture: ComponentFixture<PhenotypeAntibodyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypeAntibodyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypeAntibodyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
