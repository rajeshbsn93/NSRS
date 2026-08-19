import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceStateTableComponent } from './kisce-state-table.component';

describe('KisceStateTableComponent', () => {
  let component: KisceStateTableComponent;
  let fixture: ComponentFixture<KisceStateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceStateTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceStateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
