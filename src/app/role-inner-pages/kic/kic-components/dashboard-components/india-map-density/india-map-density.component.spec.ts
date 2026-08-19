import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiaMapDensityComponent } from './india-map-density.component';

describe('IndiaMapDensityComponent', () => {
  let component: IndiaMapDensityComponent;
  let fixture: ComponentFixture<IndiaMapDensityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndiaMapDensityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndiaMapDensityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
