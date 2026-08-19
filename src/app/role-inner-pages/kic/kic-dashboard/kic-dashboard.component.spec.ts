import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicDashboardComponent } from './kic-dashboard.component';

describe('KicDashboardComponent', () => {
  let component: KicDashboardComponent;
  let fixture: ComponentFixture<KicDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KicDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
