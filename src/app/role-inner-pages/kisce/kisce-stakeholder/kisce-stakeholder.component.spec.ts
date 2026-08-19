import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceStakeholderComponent } from './kisce-stakeholder.component';

describe('KisceStakeholderComponent', () => {
  let component: KisceStakeholderComponent;
  let fixture: ComponentFixture<KisceStakeholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceStakeholderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceStakeholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
