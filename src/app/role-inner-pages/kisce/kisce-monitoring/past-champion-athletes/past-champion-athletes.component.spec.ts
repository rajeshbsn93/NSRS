import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastChampionAthletesComponent } from './past-champion-athletes.component';

describe('PastChampionAthletesComponent', () => {
  let component: PastChampionAthletesComponent;
  let fixture: ComponentFixture<PastChampionAthletesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastChampionAthletesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastChampionAthletesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
