import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingModalComponent } from './branding-modal.component';

describe('BrandingModalComponent', () => {
  let component: BrandingModalComponent;
  let fixture: ComponentFixture<BrandingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BrandingModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
