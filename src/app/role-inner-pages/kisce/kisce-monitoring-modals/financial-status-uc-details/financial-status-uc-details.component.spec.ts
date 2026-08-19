import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialStatusUcDetailsComponent } from './financial-status-uc-details.component';

describe('FinancialStatusUcDetailsComponent', () => {
  let component: FinancialStatusUcDetailsComponent;
  let fixture: ComponentFixture<FinancialStatusUcDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FinancialStatusUcDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialStatusUcDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
