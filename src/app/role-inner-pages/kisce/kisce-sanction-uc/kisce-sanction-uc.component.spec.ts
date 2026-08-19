import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceSanctionUcComponent } from './kisce-sanction-uc.component';

describe('KisceSanctionUcComponent', () => {
  let component: KisceSanctionUcComponent;
  let fixture: ComponentFixture<KisceSanctionUcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceSanctionUcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceSanctionUcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
