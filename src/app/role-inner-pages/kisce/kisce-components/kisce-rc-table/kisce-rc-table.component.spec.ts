import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceRcTableComponent } from './kisce-rc-table.component';

describe('KisceRcTableComponent', () => {
  let component: KisceRcTableComponent;
  let fixture: ComponentFixture<KisceRcTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceRcTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceRcTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
