import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceManpowerAddStrengthDetailsComponent } from './kisce-manpower-add-strength-details.component';

describe('KisceManpowerAddStrengthDetailsComponent', () => {
  let component: KisceManpowerAddStrengthDetailsComponent;
  let fixture: ComponentFixture<KisceManpowerAddStrengthDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KisceManpowerAddStrengthDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceManpowerAddStrengthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
