import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceHoTableComponent } from './kisce-ho-table.component';

describe('KisceHoTableComponent', () => {
  let component: KisceHoTableComponent;
  let fixture: ComponentFixture<KisceHoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceHoTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceHoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
