import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionReleasedAmountUcComponent } from './sanction-released-amount-uc.component';

describe('SanctionReleasedAmountUcComponent', () => {
  let component: SanctionReleasedAmountUcComponent;
  let fixture: ComponentFixture<SanctionReleasedAmountUcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanctionReleasedAmountUcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionReleasedAmountUcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
