import { CommonModule } from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild}  from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { top } from '@popperjs/core';
import { MaterialModule } from 'src/app/_common/material.module';
import { AddAssesmentCampComponent } from '../modal-window/add-assesment-camp/add-assesment-camp.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CampManageGeoCoordinateComponent } from '../modal-window/camp-manage-geo-coordinate/camp-manage-geo-coordinate.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';
import { CampAdminService, campListEntity } from 'src/app/_common/services/camp-services/camp-admin.service';
import { first } from 'rxjs';
@Component({
    selector:'app-camp',
    templateUrl:'./camp.component.html',
    styleUrls:['./camp.component.css'],
    standalone:true,
    imports:[CommonModule,MaterialModule,ReactiveFormsModule,FormsModule, AddAssesmentCampComponent,CampManageGeoCoordinateComponent,
    LoaderComponent],
})

export class CampComponent implements OnInit{
    loader:boolean = false;
    loaderDiscipline:boolean = false;
    loaderState:boolean = false;
    topForm!:FormGroup;
    docType: string = 'Export';
    searchFilterForm!:FormGroup;
    displayedColumns:string[] = ['nsrsId','camp_name','sport_display_name','campType','atnlete_count','coach_count','ss_count','venue','geoLocation']
    dataSource:any;
    @ViewChild('exporter') exporter:any;
    @ViewChild(MatPaginator) paginator!:MatPaginator;
    @ViewChild(MatSort) sort!:MatSort;
    @ViewChild('input') searchField!: ElementRef<HTMLInputElement>;
    campListData:campListEntity[] = [];
    sportListData:any;
    stateListData:any;

  categoryDropdown = ['NCC','KI Assessment Camp']



    constructor(private fb:FormBuilder,private modalService:NgbModal, private campAdminService:CampAdminService,
      private sharableService:SharableService){}
    ngOnInit(): void { 
        this.getCampList();
        this.getSportList();
        this.getStateList();
        this.topForm = this.fb.group({
            category:['']
        });
        this.searchFilterForm = this.fb.group({
            nsrsid:[''],
            camp_name:[''],
            sport_display_name:[''],
            category:[''],
            state:[''],
        })
    }
    getCampList(){
        this.loader = true;
        this.campAdminService.campList().pipe(first()).subscribe({
            next:(response:any)=>{
                // console.log(response)
                this.loader = false;
                this.campListData = response;
                this.dataSource = new MatTableDataSource<campListEntity>(this.campListData)
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort
            },
            error:err=>{
                this.loader = false;
                console.error(err)
            }
        })
    }
    getSportList(){
      this.loaderDiscipline = true;
      this.sharableService.sportList().pipe(first()).subscribe({
        next:(response)=>{
          this.loaderDiscipline = false
          this.sportListData = response;
        },
        error:(err)=>{
          this.loaderDiscipline = false;
          console.error(err)
        }
      })
    }
    getStateList(){
      this.loaderState = true;
      this.sharableService.stateList().pipe(first()).subscribe({
        next:(response)=>{
          this.loaderState = false;
          this.stateListData = response;          
        },
        error:(err)=>{
          this.loaderState = false;
          console.error(err);
        }
      })
    }
    addCamp(){
      // console.log(this.topForm.value)
        const modalRef = this.modalService.open(AddAssesmentCampComponent,{size:'xl', centered:true,backdrop:'static'})
        modalRef.componentInstance.campType = this.topForm.value.category;
        modalRef.result
        .then((thenRes)=>{
          if(thenRes){
            this.getCampList()
          }
        })
        .catch((catRes)=>{})
    }
    exportToExcelPdfChange(event: any) {
              if (event == 'excel') {
                this.exporter.exportTable('xlsx', { fileName: 'camp', sheet: 'sheet_name', Props: { Author: 'NSRS' } })
              } else if (event == 'pdf') {
                this.getPdf()
              }
    }
    getPdf() {
        const doc = new jsPDF();
        var img = new Image();
        img.src = '../assets/images/NSRS.png';
        const temp = new jsPDF()
        autoTable(temp, { html: '#campTable' });
        for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
          doc.addImage(img, 'png', 0, 0, 200, 250);
          doc.addPage();
        }
        doc.setPage(1);
        autoTable(doc, { html: '#campTable', headStyles: { valign: 'middle', fillColor: '#1F60AB', fontSize: 5 }, theme: 'grid', bodyStyles: { fontSize: 7, fillColor: false, textColor: '#000' } });
        doc.deletePage(temp.getNumberOfPages() + 1);
        doc.save('camp.pdf');
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    search(){
        let selectedCampListData =this.campListData
        // console.log(this.searchFilterForm.value)
        if(this.searchFilterForm.value.nsrsid !=''){
          selectedCampListData = selectedCampListData.filter((data:any)=>{
            if(data.nsrs_id?.toLowerCase().includes(this.searchFilterForm.value.nsrsid.toLowerCase())){
              return data
            }
          })          
        }
        if(this.searchFilterForm.value.camp_name !=''){
          selectedCampListData = selectedCampListData.filter((data:any)=>{
            if(data.camp_name.toLowerCase().includes(this.searchFilterForm.value.camp_name.toLowerCase())){
              return data
            }
          })          
        }
        if(this.searchFilterForm.value.sport_display_name !=''){
          selectedCampListData = selectedCampListData.filter((data:any)=>{
            if(data.sport_display_name.toLowerCase().includes(this.searchFilterForm.value.sport_display_name.toLowerCase())){
              return data
            }
          })          
        }
        if(this.searchFilterForm.value.category !=''){
          selectedCampListData = selectedCampListData.filter((data:any)=>{
            if(data.campType.toLowerCase().includes(this.searchFilterForm.value.category.toLowerCase())){
              return data
            }
          })          
        }
        if(this.searchFilterForm.value.state !=''){
          selectedCampListData = selectedCampListData.filter((data:any)=>{
            if(data.state_name.toLowerCase().includes(this.searchFilterForm.value.state.toLowerCase())){
              return data
            }
          })          
        }
        if(this.searchFilterForm.value.nsrsid && this.searchFilterForm.value.camp_name == '' && this.searchFilterForm.value.sport_display_name=='' && this.searchFilterForm.value.state_name){
          selectedCampListData = this.campListData
        }
        this.dataSource = new MatTableDataSource<campListEntity>(selectedCampListData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // if (this.searchField.nativeElement.value) this.applyFilter({target: {value: this.searchField.nativeElement.value}} as unknown as Event);
    }
    openGeoLocation(rowData:any){
      // console.log(rowData);
      const modalRef = this.modalService.open(CampManageGeoCoordinateComponent,{size:'xl', centered:true,backdrop:'static'});
      modalRef.componentInstance.geoLocationRowData = rowData
      modalRef.result
      .then((thenRes)=>{
        if(thenRes){
          this.getCampList();
        }
      })
      .catch(()=>{})
    }
}