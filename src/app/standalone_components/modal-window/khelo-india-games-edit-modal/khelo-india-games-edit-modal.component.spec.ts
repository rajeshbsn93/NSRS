/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KheloIndiaGamesEditModalComponent } from './khelo-india-games-edit-modal.component';

describe('KheloIndiaGamesEditModalComponent', () => {
  let component: KheloIndiaGamesEditModalComponent;
  let fixture: ComponentFixture<KheloIndiaGamesEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KheloIndiaGamesEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KheloIndiaGamesEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
