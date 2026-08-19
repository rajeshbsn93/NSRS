import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceMonitoringModalViewComponent } from './kisce-monitoring-modal-view.component';

describe('KisceMonitoringModalViewComponent', () => {
  let component: KisceMonitoringModalViewComponent;
  let fixture: ComponentFixture<KisceMonitoringModalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KisceMonitoringModalViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceMonitoringModalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
