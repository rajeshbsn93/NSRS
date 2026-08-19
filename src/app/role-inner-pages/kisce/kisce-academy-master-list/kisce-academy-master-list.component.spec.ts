import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceAcademyMasterListComponent } from './kisce-academy-master-list.component';

describe('KisceAcademyMasterListComponent', () => {
  let component: KisceAcademyMasterListComponent;
  let fixture: ComponentFixture<KisceAcademyMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceAcademyMasterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceAcademyMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
