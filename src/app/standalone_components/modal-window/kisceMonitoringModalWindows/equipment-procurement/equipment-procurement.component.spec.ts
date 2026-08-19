import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentProcurementComponent } from './equipment-procurement.component';

describe('EquipmentProcurementComponent', () => {
  let component: EquipmentProcurementComponent;
  let fixture: ComponentFixture<EquipmentProcurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ EquipmentProcurementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentProcurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
