import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.css']
})
export class SummaryCardComponent implements OnInit {

  constructor() { }

  @Input() cardList: any = []
  @Input() loader: boolean = false;
  @Input() cardType: string = 'state'

  ngOnInit(): void {
  }
  getKisceCoachRatio(card: any): string {
  if (!card?.no_of_kics || !card?.no_of_coaches || card.no_of_coaches === 0) {
    return 'N/A';
  }
  return (card.no_of_coaches / card.no_of_kics).toFixed(2);
}


}
