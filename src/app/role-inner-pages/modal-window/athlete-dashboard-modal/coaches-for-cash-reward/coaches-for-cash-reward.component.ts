import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/_common/material.module';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { AddCoachesForCashRewardComponent } from '../add-coaches-for-cash-reward/add-coaches-for-cash-reward.component';
import { AthleteCoachACTCService, CashAwardTrainingDetailsEntity, CashAwardTrainingDetailsListEntity} from 'src/app/_common/services/common-services/athlete-coach-Actc.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AthleteActcEsignConfirmationDialogComponent } from '../athlete-actc-esign-confirmation-dialog/athlete-actc-esign-confirmation-dialog.component';
import { environment } from 'src/environments/environment';
import { MessageDialogComponent } from 'src/app/standalone_components/modal-window/message-dialog/message-dialog.component';
declare var Digio:any

@Component({
  selector: 'app-coaches-for-cash-reward',
  templateUrl: './coaches-for-cash-reward.component.html',
  styleUrls: ['./coaches-for-cash-reward.component.css'],
  standalone:true,
  imports:[CommonModule,MaterialModule,LoaderComponent,ReactiveFormsModule,MatDialogModule]
})
export class CoachesForCashRewardComponent implements OnInit {
loader:boolean = false;
    rowData:any;
    userDetails:any;
    cashAwardTrainingTableColumns:String[] =['nsrs_id','coach','period','level','mapping_type','action']
    subject:Subject<any> = new Subject();
    @ViewChild(MatPaginator) paginator!:MatPaginator;
    @ViewChild(MatSort) sort!:MatSort;
    @ViewChild('deleteModalRef') deleteModalRef:any
    cashAwardTrainingDetailsData = new MatTableDataSource<any>();
    deleteRowData!:any;
    deleteModal:any;
    esignForm!:FormGroup;
    fileUrl = environment.fileUrl;
    hideAddEsign:boolean = false

    constructor(
        public activeModal:NgbActiveModal,
        // private storageService:StorageService,
        private athleteCoachACTCService:AthleteCoachACTCService,
        private alertService:AlertService,
        private modalService:NgbModal,
        private _fb:FormBuilder,
        public dialog: MatDialog
        ){}
    ngOnInit(): void {
        // this.userDetails = this.storageService.getUserDetails();
        this.getCashAwardTrainingDetails();
        this.esignForm = this._fb.group({
            place:['', Validators.required]
        })
    }
    getCashAwardTrainingDetails(){
        this.loader = true
        this.athleteCoachACTCService.getCashAwardTrainingDetails(
            this.rowData.Player_Detail_id,
            this.rowData.proposal_Id,
            this.rowData.event_id
            ).pipe(
                takeUntil(this.subject)
                ).subscribe({
                    next:(res:CashAwardTrainingDetailsEntity)=>{
                        this.loader = false;
                        // console.log(res)
                        if(res.status){
                            this.hideAddEsign = res.data[0] ? res.data[0].is_eSigned : false
                            this.cashAwardTrainingDetailsData = new MatTableDataSource<CashAwardTrainingDetailsListEntity>(res.data);
                            this.cashAwardTrainingDetailsData.paginator = this.paginator;
                            this.cashAwardTrainingDetailsData.sort = this.sort

                        }else{
                        this.alertService.swalPopError(res.message)
                        }
                    },
                    error:(err)=>{
                        this.loader = false
                    }
                })
    }
    addCoach(){
        const modalRef = this.modalService.open(
            AddCoachesForCashRewardComponent,
            {
                size:'xl',
                centered:true,
                backdrop:'static',
                keyboard:false
            }
        )
        modalRef.componentInstance.rowData = this.rowData;
        modalRef.result
        .then((res)=>{
            // console.log(res)
            if(res) this.getCashAwardTrainingDetails();

        })
        .catch((res)=>{
        })
    }

    deleteGame(rowData:any){
        // console.log(rowData)
        this.deleteRowData = rowData
       this.deleteModal =  this.modalService.open(
            this.deleteModalRef,
            {
                centered:true,
                size:'md'
            }
            )
    }
    confirmDelete(){
        this.loader = true;
        this.athleteCoachACTCService.deleteCashAwardTrainingDetails(this.deleteRowData.srNo).subscribe({
            next:(response:any)=>{
                this.loader = false
                // console.log(response)
                if(response.status){
                    this.deleteModal.close();
                    this.alertService.swalPopSuccess(response.error)
                    this.getCashAwardTrainingDetails();
                }else{
                    this.alertService.swalPopError(response.error)
                }
            },
            error:(err)=>{
                this.loader = false;
                console.error(err)
            }
        })
    }
    esign(){
        if(this.esignForm.valid){
            if(this.rowData.pendingdays_toesign>0){
                const dialogRef = this.dialog.open(AthleteActcEsignConfirmationDialogComponent,{
                    maxWidth:'460px',
                    autoFocus:false,
                    width:'460px',
                });
    
                dialogRef.afterClosed().subscribe(result => {
                // console.log(`Dialog result: ${result}`);
                if(result) this.generateCashAwardAffidavit()
                });
                
            }else{
                const messageData = {
                    engText:'E-sign is not allowed because time limit to submit the declaration is expired.',
                    hindiText:'ई-हस्ताक्षर की अनुमति नहीं है क्योंकि घोषणा प्रस्तुत करने की समय सीमा समाप्त हो गई है |',
                }
                const dialogRef = this.dialog.open(MessageDialogComponent,{
                    maxWidth:'460px',
                    autoFocus:false,
                    width:'460px',
                    data:messageData
                })                
            }
        }else{
            this.esignForm.markAllAsTouched();
        }        
    }
    generateCashAwardAffidavit(){
        this.loader =true;
        this.athleteCoachACTCService.generateCashAwardAffidavit(
            this.rowData.Player_Detail_id,
            this.rowData.proposal_Id,
            this.esignForm.get('place')?.value,
            this.rowData.event_id
        ).subscribe({
            next:(res:any)=>{
                this.loader = false;
                // console.log(res)
                if(res?.access_token){
                   this.initializeDigio(res?.access_token?.entity_id ,res?.signing_parties[0]?.identifier ,res?.access_token?.id);
               }
            },
            error:(err)=>{
                this.loader = false;
                console.error(err)
            }
        })
    }
    initializeDigio(entityId:string,identifier:string,id:string) {
 
        var options = {
          environment : environment.envDigioType,
          callback : (response:any)=>{
          if(response.hasOwnProperty("error_code")){
        this.alertService.swalPopError('Something Went Wrong. Please Try Again!!')
          }else{
                     this.downloadCashAwardAffidavit(response)
          }
          },
          logo : "https://nsrs.kheloindia.gov.in/assets/images/Logo6.svg", 
          theme : {
          primaryColor : "#1F60AB",
          secondaryColor : "#000000"
          }
          }
          
          var digio = new Digio(options)
          digio.init()
          digio.submit(entityId,identifier,id)
        //   this.isLoading=true
           
    }
    downloadCashAwardAffidavit(successRes:any){
        this.loader=true
        this.athleteCoachACTCService.downloadCashAwardAffidavit(
            this.rowData.Player_Detail_id,
            this.rowData.proposal_Id,
            successRes?.digio_doc_id,
            this.rowData.event_id
        ).subscribe({
              next: (res:any) => {
                // console.log(res)
                this.loader = false;
                if(res?.FilePath){
                     let urlPath=this.fileUrl+res?.FilePath
                     this.getCashAwardTrainingDetails();
                     this.triggerDownload(urlPath)
                }
              },
              error: (error) => {
                this.loader = false
                this.alertService.swalPopError('Something Went Wrong. Please Try Again!!')
              },
            });
    }
    
    triggerDownload(url: string) {
        this.hideAddEsign = true
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = 'downloaded.pdf'; // Set the desired filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Clean up the blob URL
       
    }


    
}
