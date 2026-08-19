import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reimbursement-details',
  templateUrl: './reimbursement-details.component.html',
  styleUrls: ['./reimbursement-details.component.css']
})
export class ReimbursementDetailsComponent implements OnInit {
  insuranceData:any
  athleteReimbursementDetails:any
  athleteReimbursementDetailsLength:any
  commonData:any
  menuName:any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    //console.log(this.insuranceData)
    //console.log(this.commonData)
    if(this.menuName=='athlete'){
      //console.log(this.insuranceData.athleteInsurance_ReimbursementHistory)
      this.athleteReimbursementDetails=this.insuranceData.athleteInsurance_ReimbursementHistory
      this.athleteReimbursementDetailsLength=this.athleteReimbursementDetails.length
    }

    if(this.menuName=='coach'){
      //console.log(this.insuranceData.officialInsurance_ReimbursementHistories)
      this.athleteReimbursementDetails=this.insuranceData.officialInsurance_ReimbursementHistories
      this.athleteReimbursementDetailsLength=this.athleteReimbursementDetails.length
      
    }
    

  }

}
