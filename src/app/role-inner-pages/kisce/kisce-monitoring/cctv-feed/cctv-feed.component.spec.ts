import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CctvFeedComponent } from './cctv-feed.component';

describe('CctvFeedComponent', () => {
  let component: CctvFeedComponent;
  let fixture: ComponentFixture<CctvFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CctvFeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CctvFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
