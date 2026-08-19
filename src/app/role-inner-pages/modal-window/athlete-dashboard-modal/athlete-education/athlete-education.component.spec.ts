import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteEducationComponent } from './athlete-education.component';

describe('AthleteEducationComponent', () => {
  let component: AthleteEducationComponent;
  let fixture: ComponentFixture<AthleteEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AthleteEducationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthleteEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
