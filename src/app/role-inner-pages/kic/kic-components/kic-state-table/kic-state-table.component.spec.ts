import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicStateTableComponent } from './kic-state-table.component';

describe('KicStateTableComponent', () => {
  let component: KicStateTableComponent;
  let fixture: ComponentFixture<KicStateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KicStateTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicStateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
