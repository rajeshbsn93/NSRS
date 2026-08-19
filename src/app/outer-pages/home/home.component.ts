import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { distinctUntilChanged, filter, first, map, mergeMap, Observable, Subscription, switchMap } from 'rxjs';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('athleteCount') athleteCountElement!: ElementRef;
  @ViewChild('couchCount') couchCountElement!: ElementRef;
  @ViewChild('sportsScientistCount') sportsScientistCountElement!: ElementRef;
  @ViewChild('trainingCenterCount') trainingCenterCountElement!: ElementRef;
  subscription: Subscription = new Subscription();

  countingData: any;
  loaderMain: boolean = true;
  
  constructor(private sharableService: SharableService) {}

  slidesStore = [
    {image:"assets/images/slider_1.png",title:"Indian Men's Relay Team"},
    {image:"assets/images/manu-bhaker.png",title:"Manu Bhaker"},
    {image:"assets/images/gukesh-dommaraju.png",title:"Gukesh Dommaraju"},
    {image:"assets/images/lakshya-sen.png",title:"Lakshya Sen"},
  ]
  // slidesStore = [
  //   {image:"assets/images/new-banner-home.png",title:""},
  //   {image:"assets/images/new-banner-home.png",title:""},
  //   {image:"assets/images/new-banner-home.png",title:""},
  // ]
  
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    autoplay: true,
    dots: true,
    navSpeed: 700,
    nav: false,
    responsive: {
      0: { items: 1 },
      400: { items: 1 },
      740: { items: 1 },
      940: { items: 1 },
    }
  };

  goToSsoLoginPage() {
    window.open(environment.ssoLoginUrl + 'login?appId=' + environment.encrAppId, '_self');
  }

  ngAfterViewInit(): void {
    this.getCounting();
  }

  getCounting() {
    this.sharableService
      .getCounting()
      .pipe(first(),switchMap((res) => {
        this.loaderMain = false;
        this.countingData = res;
        return this.createAndObserve(this.athleteCountElement)
        .pipe(filter(Boolean), first())
      }))
      .subscribe({
        next: () => {
          this.animateCount(this.athleteCountElement, 0, parseInt(this.countingData.total_Athlete), 2000);
          this.animateCount(this.couchCountElement, 0, parseInt(this.countingData.total_Coach), 2000);
          this.animateCount(this.sportsScientistCountElement, 0, parseInt(this.countingData.total_SportsScientist), 2000);
          this.animateCount(this.trainingCenterCountElement, 0, parseInt(this.countingData.total_Academy), 2000);
        },
        error: () => {
          console.error('error caught in counting');
          this.loaderMain = false;
        },
      });
  }

  animateCount(
    element: ElementRef,
    initVal: number,
    lastVal: number,
    duration: number
  ) {
    let startTime: any = null;

    // get the current timestamp and assign it to the currentTime variable
    // let currentTime = Date.now();

    //pass the current timestamp to the step function
    const step = (currentTime: any) => {
      //if the start time is null, assign the current time to startTime
      if (!startTime) {
        startTime = currentTime;
      }

      //calculate the value to be used in calculating the number to be displayed
      const progress = Math.min((currentTime - startTime) / duration, 1);

      //calculate what to be displayed using the value gotten above
      element.nativeElement.textContent = Math.floor(
        progress * (lastVal - initVal) + initVal
      );

      //checking to make sure the counter does not exceed the last value (lastVal)
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        window.cancelAnimationFrame(window.requestAnimationFrame(step));
      }
    };
    //start animating
    window.requestAnimationFrame(step);
  }

  createAndObserve(element: ElementRef): Observable<boolean> {
    return new Observable<IntersectionObserverEntry[]>((observer) => {
      const intersectionObserver = new IntersectionObserver(entries => {
        observer.next(entries);
      });
  
      intersectionObserver.observe(element.nativeElement);
  
      return () => { intersectionObserver.disconnect(); };
    }).pipe(
      mergeMap((entries: IntersectionObserverEntry[]) => entries),
      map((entry: IntersectionObserverEntry) => entry.isIntersecting),
      distinctUntilChanged()
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
