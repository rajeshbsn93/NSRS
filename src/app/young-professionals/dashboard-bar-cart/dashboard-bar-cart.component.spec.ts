import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBarCartComponent } from './dashboard-bar-cart.component';

describe('DashboardBarCartComponent', () => {
  let component: DashboardBarCartComponent;
  let fixture: ComponentFixture<DashboardBarCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardBarCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardBarCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
