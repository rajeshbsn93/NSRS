import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachInformationActcComponent } from './coach-information-actc.component';

describe('CoachInformationActcComponent', () => {
  let component: CoachInformationActcComponent;
  let fixture: ComponentFixture<CoachInformationActcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachInformationActcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachInformationActcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
