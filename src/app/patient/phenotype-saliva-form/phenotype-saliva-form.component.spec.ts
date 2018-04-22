import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypeSalivaFormComponent } from './phenotype-saliva-form.component';

describe('PhenotypeSalivaFormComponent', () => {
  let component: PhenotypeSalivaFormComponent;
  let fixture: ComponentFixture<PhenotypeSalivaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypeSalivaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypeSalivaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
