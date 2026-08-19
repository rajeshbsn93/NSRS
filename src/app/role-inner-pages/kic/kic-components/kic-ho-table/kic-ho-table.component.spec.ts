import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicHoTableComponent } from './kic-ho-table.component';

describe('KicHoTableComponent', () => {
  let component: KicHoTableComponent;
  let fixture: ComponentFixture<KicHoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KicHoTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicHoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
