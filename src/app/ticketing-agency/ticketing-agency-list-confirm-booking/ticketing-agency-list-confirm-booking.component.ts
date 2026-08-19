import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-ticketing-agency-list-confirm-booking',
  templateUrl: './ticketing-agency-list-confirm-booking.component.html',
  styleUrls: ['./ticketing-agency-list-confirm-booking.component.css']
})
export class TicketingAgencyListConfirmBookingComponent implements OnInit {
  @Input() proposalListData:any
  displayedColumns: string[] = [
    'sl_no',
    'proposal_type',
    'proposal_id',
    'name',
    'mobile_no',
    'departure_date',
    'return_date',
    'origin',
    'destination',
    'bags',
    'insurance',
    'passport',
    'ticket_upload'
  ];
  pendingForm!:FormGroup
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  constructor(
    private _fb:FormBuilder
  ) { 
    this.formInitialization();
  }

  ngOnInit() {
  //   this.dataSource=[
  //     {
  //     nsrsid:'d'
  //   }
  // ]
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.proposalListData)
    if(this.proposalListData.length){
      this.proposalListData.forEach((item:any)=>{
        this.addItemTicketing(item)
      })
      this.dataSource.data = this.pendingFormArray.controls
    }
  }
  formInitialization(){
    this.pendingForm = this._fb.group({
      items: this._fb.array([])
    })
  }

  get pendingFormArray():FormArray{
    return this.pendingForm.get('items') as FormArray
  }
  
  addItemTicketing(item:any){
    const group = this._fb.group({
      proposal_Id:item.proposal_Id
    })
    this.pendingFormArray.push(group)
  }

  save(){
    // this.selectedTabIndex.emit(1)
    console.log(this.pendingFormArray.value)
  }

}
