import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionReleasedKisceUcComponent } from './sanction-released-kisce-uc.component';

describe('SanctionReleasedKisceUcComponent', () => {
  let component: SanctionReleasedKisceUcComponent;
  let fixture: ComponentFixture<SanctionReleasedKisceUcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanctionReleasedKisceUcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionReleasedKisceUcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
