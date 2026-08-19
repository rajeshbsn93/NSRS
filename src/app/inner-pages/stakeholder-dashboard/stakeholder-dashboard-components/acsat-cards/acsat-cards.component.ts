import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-acsat-cards',
  templateUrl: './acsat-cards.component.html',
  styleUrls: ['./acsat-cards.component.css']
})
export class AcsatCardsComponent implements OnInit, OnChanges{
  userDetails:any;
  @Input() cardListData:any
  cardData:any
  constructor() {}

  ngOnInit() {
    
   
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.cardListData)
    this.cardData = this.cardListData
  }  

}
