import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativesFormComponent } from './relatives-form.component';

describe('RelativesFormComponent', () => {
  let component: RelativesFormComponent;
  let fixture: ComponentFixture<RelativesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelativesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelativesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
