import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionReleasedAmountComponent } from './sanction-released-amount.component';

describe('SanctionReleasedAmountComponent', () => {
  let component: SanctionReleasedAmountComponent;
  let fixture: ComponentFixture<SanctionReleasedAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanctionReleasedAmountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionReleasedAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
