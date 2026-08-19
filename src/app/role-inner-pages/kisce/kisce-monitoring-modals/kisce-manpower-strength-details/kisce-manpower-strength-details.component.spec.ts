import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceManpowerStrengthDetailsComponent } from './kisce-manpower-strength-details.component';

describe('KisceManpowerStrengthDetailsComponent', () => {
  let component: KisceManpowerStrengthDetailsComponent;
  let fixture: ComponentFixture<KisceManpowerStrengthDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KisceManpowerStrengthDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceManpowerStrengthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
