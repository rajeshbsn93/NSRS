import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionTotalAmountComponent } from './sanction-total-amount.component';

describe('SanctionTotalAmountComponent', () => {
  let component: SanctionTotalAmountComponent;
  let fixture: ComponentFixture<SanctionTotalAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanctionTotalAmountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionTotalAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
