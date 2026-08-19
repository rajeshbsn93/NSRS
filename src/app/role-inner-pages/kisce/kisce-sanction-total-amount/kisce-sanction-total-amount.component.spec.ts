import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceSanctionTotalAmountComponent } from './kisce-sanction-total-amount.component';

describe('KisceSanctionTotalAmountComponent', () => {
  let component: KisceSanctionTotalAmountComponent;
  let fixture: ComponentFixture<KisceSanctionTotalAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceSanctionTotalAmountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceSanctionTotalAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
