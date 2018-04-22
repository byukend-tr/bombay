import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypeHomeComponent } from './phenotype-home.component';

describe('PhenotypeHomeComponent', () => {
  let component: PhenotypeHomeComponent;
  let fixture: ComponentFixture<PhenotypeHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypeHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
