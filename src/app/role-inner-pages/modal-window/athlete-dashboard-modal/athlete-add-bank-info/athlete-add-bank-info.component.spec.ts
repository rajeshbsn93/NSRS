import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteAddBankInfoComponent } from './athlete-add-bank-info.component';

describe('AthleteAddBankInfoComponent', () => {
  let component: AthleteAddBankInfoComponent;
  let fixture: ComponentFixture<AthleteAddBankInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AthleteAddBankInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthleteAddBankInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
