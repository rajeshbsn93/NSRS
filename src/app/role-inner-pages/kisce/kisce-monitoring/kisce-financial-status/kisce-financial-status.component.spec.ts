import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceFinancialStatusComponent } from './kisce-financial-status.component';

describe('KisceFinancialStatusComponent', () => {
  let component: KisceFinancialStatusComponent;
  let fixture: ComponentFixture<KisceFinancialStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceFinancialStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceFinancialStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
