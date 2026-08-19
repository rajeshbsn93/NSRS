import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CctcFeedComponent } from './cctc-feed.component';

describe('CctcFeedComponent', () => {
  let component: CctcFeedComponent;
  let fixture: ComponentFixture<CctcFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CctcFeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CctcFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
