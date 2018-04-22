import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenotypeHomeComponent } from './genotype-home.component';
import {} from 'jasmine';

describe('GenotypeHomeComponent', () => {
  let component: GenotypeHomeComponent;
  let fixture: ComponentFixture<GenotypeHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenotypeHomeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenotypeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
