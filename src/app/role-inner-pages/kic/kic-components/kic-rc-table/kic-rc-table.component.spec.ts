import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicRcTableComponent } from './kic-rc-table.component';

describe('KicRcTableComponent', () => {
  let component: KicRcTableComponent;
  let fixture: ComponentFixture<KicRcTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KicRcTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicRcTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
