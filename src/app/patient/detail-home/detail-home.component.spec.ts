import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailHomeComponent } from './detail-home.component';

describe('DetailHomeComponent', () => {
  let component: DetailHomeComponent;
  let fixture: ComponentFixture<DetailHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
