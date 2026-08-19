import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionReleasedKisceComponent } from './sanction-released-kisce.component';

describe('SanctionReleasedKisceComponent', () => {
  let component: SanctionReleasedKisceComponent;
  let fixture: ComponentFixture<SanctionReleasedKisceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanctionReleasedKisceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionReleasedKisceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
