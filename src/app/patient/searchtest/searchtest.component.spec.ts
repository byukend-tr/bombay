import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchtestComponent } from './searchtest.component';

describe('SearchtestComponent', () => {
  let component: SearchtestComponent;
  let fixture: ComponentFixture<SearchtestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchtestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
