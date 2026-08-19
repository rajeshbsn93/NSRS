import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicSanctionListComponent } from './kic-sanction-list.component';

describe('KicSanctionListComponent', () => {
  let component: KicSanctionListComponent;
  let fixture: ComponentFixture<KicSanctionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KicSanctionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicSanctionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
