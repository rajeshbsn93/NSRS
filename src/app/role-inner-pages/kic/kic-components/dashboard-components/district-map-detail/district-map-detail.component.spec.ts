import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictMapDetailComponent } from './district-map-detail.component';

describe('DistrictMapDetailComponent', () => {
  let component: DistrictMapDetailComponent;
  let fixture: ComponentFixture<DistrictMapDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrictMapDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistrictMapDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
