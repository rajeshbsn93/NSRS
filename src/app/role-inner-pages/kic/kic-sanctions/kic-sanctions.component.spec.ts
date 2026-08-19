import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicSanctionsComponent } from './kic-sanctions.component';

describe('KicSanctionsComponent', () => {
  let component: KicSanctionsComponent;
  let fixture: ComponentFixture<KicSanctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KicSanctionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicSanctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
