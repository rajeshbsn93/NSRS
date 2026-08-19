import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceSanctionsComponent } from './kisce-sanctions.component';

describe('KisceSanctionsComponent', () => {
  let component: KisceSanctionsComponent;
  let fixture: ComponentFixture<KisceSanctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceSanctionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceSanctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
