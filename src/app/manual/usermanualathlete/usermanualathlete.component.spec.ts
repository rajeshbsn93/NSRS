import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermanualathleteComponent } from './usermanualathlete.component';

describe('UsermanualathleteComponent', () => {
  let component: UsermanualathleteComponent;
  let fixture: ComponentFixture<UsermanualathleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsermanualathleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsermanualathleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
