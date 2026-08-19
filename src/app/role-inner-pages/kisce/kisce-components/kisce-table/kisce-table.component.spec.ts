import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceTableComponent } from './kisce-table.component';

describe('KisceTableComponent', () => {
  let component: KisceTableComponent;
  let fixture: ComponentFixture<KisceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
