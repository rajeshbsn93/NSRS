import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMeetingModalComponent } from './schedule-meeting-modal.component';

describe('ScheduleMeetingModalComponent', () => {
  let component: ScheduleMeetingModalComponent;
  let fixture: ComponentFixture<ScheduleMeetingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ScheduleMeetingModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleMeetingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
