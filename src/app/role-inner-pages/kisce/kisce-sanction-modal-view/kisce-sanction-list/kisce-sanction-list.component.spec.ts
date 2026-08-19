import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceSanctionListComponent } from './kisce-sanction-list.component';

describe('KisceSanctionListComponent', () => {
  let component: KisceSanctionListComponent;
  let fixture: ComponentFixture<KisceSanctionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KisceSanctionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceSanctionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
