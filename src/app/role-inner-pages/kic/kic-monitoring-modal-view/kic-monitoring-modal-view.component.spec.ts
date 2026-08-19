import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicMonitoringModalViewComponent } from './kic-monitoring-modal-view.component';

describe('KicMonitoringModalViewComponent', () => {
  let component: KicMonitoringModalViewComponent;
  let fixture: ComponentFixture<KicMonitoringModalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KicMonitoringModalViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicMonitoringModalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
