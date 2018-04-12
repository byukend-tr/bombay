import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypeAboFormComponent } from './phenotype-abo-form.component';

describe('PhenotypeAboFormComponent', () => {
  let component: PhenotypeAboFormComponent;
  let fixture: ComponentFixture<PhenotypeAboFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypeAboFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypeAboFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
