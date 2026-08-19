import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceCctvFeedComponent } from './kisce-cctv-feed.component';

describe('KisceCctvFeedComponent', () => {
  let component: KisceCctvFeedComponent;
  let fixture: ComponentFixture<KisceCctvFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KisceCctvFeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceCctvFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
