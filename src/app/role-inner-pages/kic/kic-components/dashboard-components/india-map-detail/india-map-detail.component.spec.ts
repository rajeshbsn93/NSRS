import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiaMapDetailComponent } from './india-map-detail.component';

describe('IndiaMapDetailComponent', () => {
  let component: IndiaMapDetailComponent;
  let fixture: ComponentFixture<IndiaMapDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndiaMapDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndiaMapDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
