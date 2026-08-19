/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddAthleteAchievementTournamentComponent } from './add-athlete-achievement-tournament.component';

describe('AddAthleteAchievementTournamentComponent', () => {
  let component: AddAthleteAchievementTournamentComponent;
  let fixture: ComponentFixture<AddAthleteAchievementTournamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAthleteAchievementTournamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAthleteAchievementTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
