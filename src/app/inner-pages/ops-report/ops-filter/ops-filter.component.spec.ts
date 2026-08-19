import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsFilterComponent } from './ops-filter.component';

describe('OpsFilterComponent', () => {
  let component: OpsFilterComponent;
  let fixture: ComponentFixture<OpsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpsFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
