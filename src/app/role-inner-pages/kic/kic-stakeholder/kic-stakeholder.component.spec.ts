import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicStakeholderComponent } from './kic-stakeholder.component';

describe('KicStakeholderComponent', () => {
  let component: KicStakeholderComponent;
  let fixture: ComponentFixture<KicStakeholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KicStakeholderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicStakeholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
