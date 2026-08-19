import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicMonitoringComponent } from './kic-monitoring.component';

describe('KicMonitoringComponent', () => {
  let component: KicMonitoringComponent;
  let fixture: ComponentFixture<KicMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KicMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
