import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteAddEducationInfoComponent } from './athlete-add-education-info.component';

describe('AthleteAddEducationInfoComponent', () => {
  let component: AthleteAddEducationInfoComponent;
  let fixture: ComponentFixture<AthleteAddEducationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AthleteAddEducationInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthleteAddEducationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
