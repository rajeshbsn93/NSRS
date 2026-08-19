import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceMonitoringTrainingDetailsComponent } from './kisce-monitoring-training-details.component';

describe('KisceMonitoringTrainingDetailsComponent', () => {
  let component: KisceMonitoringTrainingDetailsComponent;
  let fixture: ComponentFixture<KisceMonitoringTrainingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KisceMonitoringTrainingDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceMonitoringTrainingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
