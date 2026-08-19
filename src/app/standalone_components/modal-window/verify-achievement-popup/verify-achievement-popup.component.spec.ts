import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAchievementPopupComponent } from './verify-achievement-popup.component';

describe('VerifyAchievementPopupComponent', () => {
  let component: VerifyAchievementPopupComponent;
  let fixture: ComponentFixture<VerifyAchievementPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyAchievementPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyAchievementPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
