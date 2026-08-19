import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProposalKisceComponent } from './add-proposal-kisce.component';

describe('AddProposalKisceComponent', () => {
  let component: AddProposalKisceComponent;
  let fixture: ComponentFixture<AddProposalKisceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProposalKisceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProposalKisceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
