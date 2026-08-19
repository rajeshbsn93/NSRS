import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceAddProposalComponent } from './kisce-add-proposal.component';

describe('KisceAddProposalComponent', () => {
  let component: KisceAddProposalComponent;
  let fixture: ComponentFixture<KisceAddProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceAddProposalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceAddProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
