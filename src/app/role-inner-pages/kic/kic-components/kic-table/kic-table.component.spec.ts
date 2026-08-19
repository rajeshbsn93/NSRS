import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicTableComponent } from './kic-table.component';

describe('KicTableComponent', () => {
  let component: KicTableComponent;
  let fixture: ComponentFixture<KicTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KicTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
