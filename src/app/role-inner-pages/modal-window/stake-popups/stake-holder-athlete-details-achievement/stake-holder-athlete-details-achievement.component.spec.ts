import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeHolderAthleteDetailsAchievementComponent } from './stake-holder-athlete-details-achievement.component';

describe('StakeHolderAthleteDetailsAchievementComponent', () => {
  let component: StakeHolderAthleteDetailsAchievementComponent;
  let fixture: ComponentFixture<StakeHolderAthleteDetailsAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakeHolderAthleteDetailsAchievementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StakeHolderAthleteDetailsAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
