import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProjectRoleMappingComponent } from './manage-project-role-mapping.component';

describe('ManageProjectRoleMappingComponent', () => {
  let component: ManageProjectRoleMappingComponent;
  let fixture: ComponentFixture<ManageProjectRoleMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageProjectRoleMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProjectRoleMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
