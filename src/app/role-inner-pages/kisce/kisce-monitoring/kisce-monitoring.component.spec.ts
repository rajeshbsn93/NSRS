import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceMonitoringComponent } from './kisce-monitoring.component';

describe('KisceMonitoringComponent', () => {
  let component: KisceMonitoringComponent;
  let fixture: ComponentFixture<KisceMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
