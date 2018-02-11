import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionHomeComponent } from './decision-home.component';

describe('DecisionHomeComponent', () => {
  let component: DecisionHomeComponent;
  let fixture: ComponentFixture<DecisionHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
