import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CONTENT_TYPE_APPLICATION } from 'mat-table-exporter';
import { debounceTime, switchMap, Observable, findIndex } from 'rxjs';
import { AlertService } from 'src/app/_common/services/common-services/alert.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { OpsReportService } from 'src/app/_common/services/innerPagesServices/ops-report.service';
import { NgZone } from '@angular/core';
export interface PeriodicElement {

  "SCHEME":string,
  "ACADEMY":string,
  "DISCIPLINE":string,
  "STATE":string,
  "MALE":number,
  "FEMALE":number,
  "NON RESIDENTIAL":string,
  "RESIDENTIAL": string,
  "TOTAL ATHLETE":number,
}

@Component({
  selector: 'app-ops-filter',
  templateUrl: './ops-filter.component.html',
  styleUrls: ['./ops-filter.component.css']
})
export class OpsFilterComponent implements OnInit {

  @Input() showFilter:any
  @Input() title:string=''
  @Input() isRS:string=''
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  
  @Output() displayCol= new EventEmitter()
  @Output() tableData= new EventEmitter()
  
    dataSource:any=[]
    opsFilterForm!:FormGroup;
    displayedColumns:any=[]
    schemaSearch: FormControl = new FormControl();
    sportsCenterSearch: FormControl = new FormControl();
    sportsDisciplineSearch: FormControl = new FormControl();
    stateSearch: FormControl = new FormControl();
    genderSearch: FormControl = new FormControl();
    isLoading:Boolean=false
    userData:any
    allAcademyList:any=[]
    deepCopySchemaList:any
    deepSportsTrainingCenterList:any
    deepCopyDisciplinesList:any
    deepCopyStateList:any
    deepCopyGenderList:any
    deepCopyResidentialStatusList:any
  
    dummyData:any=[]
       filterName=''
    filterNameList:any=[{
      name:'Scheme',
      id:1,
      controlerName:'isSchemaCol',
      checkParam:'SCHEME',
      searchInput:'schemaSearch',
      filterListVar:'deepCopySchemaList'
    },
    {
      name:'Sports Training Center',
      id:2,
      controlerName:'isTrainingCenterCol',
      checkParam:'ACADEMY',
      searchInput:'sportsCenterSearch',
        filterListVar:'deepSportsTrainingCenterList'
    },
    {
      name:'Discipline',
      id:3,
      controlerName:'isDisciplineCol',
      checkParam:'DISCIPLINE',
      searchInput:'sportsDisciplineSearch',
        filterListVar:'deepCopyDisciplinesList'
    },
    {
      name:'State',
      id:4,
      controlerName:'isStateCol',
      checkParam:'STATE',
      searchInput:'stateSearch',
        filterListVar:'deepCopyStateList'
    },
    {
      name:'Gender',
      id:5,
      controlerName:'isGenderCol',
      checkParam:'genderList',
      searchInput:'genderSearch',
        filterListVar:'deepCopyGenderList'
    },
   

  
  ]

  commanFilterList:any=[]
  fixColIndex=['SCHEME','ACADEMY','DISCIPLINE','STATE','MALE','FEMALE','RESIDENTIAL','NON RESIDENTIAL']
  
  allSelectedListObj:any={
    schemaList: [] , 
    sportsTrainingCenterList:[],
    sportsDisciplineList:[],
    stateList:[],
    genderList:[],
    residentialStatusList:[],
    isSchemaCol:[true],
    isTrainingCenterCol:[true],
    isDisciplineCol:[true],
    isStateCol:[true],
    isGenderCol:[true],
    isResidentialCol:[true]
  }
  text = 'Select All'; 
  
  @Inject(MAT_DIALOG_DATA) public data!: any
  isPupup=false
    constructor(

      private fb: FormBuilder,
      private opsReportService:OpsReportService,
      private alertService:AlertService,
      private storageService:StorageService,
      private dialog: MatDialog,
      private cdRef: ChangeDetectorRef,
      private ngZone: NgZone
    ) {
  
   
  
      
    }
  
    ngOnInit(): void {

       

      
      this.createForm()
    }
  

    createForm(){
      this.opsFilterForm = this.fb.group({
        schemaList: [] , 
        sportsTrainingCenterList:[],
        sportsDisciplineList:[],
        stateList:[],
        genderList:[],
        residentialStatusList:[],
        isSchemaCol:[true],
        isTrainingCenterCol:[true],
        isDisciplineCol:[true],
        isStateCol:[true],
        isGenderCol:[true],
        isResidentialCol:[true]
      });

      this.getIntialData()
    }
  
  
    getIntialData(){
      this.filterName='schemaSearch'
      if(this.isRS==='athlete'){
        this.filterNameList.push( {
          name:'Residential Status',
          id:6,
          controlerName:'isResidentialCol',
          checkParam:'residentialStatusList',
          searchInput:'residentialSearch',
            filterListVar:'deepCopyResidentialStatusList'
        })
            }
           this.userData = this.storageService.getUserDetails()
           this.getDisciplineList()
           this.getStateList()
           this.getGenderList()
           this.getResidentialStatusList()
            if(this.userData){
              this.fetchSchemaList()
            }
      
            this.opsFilterForm.valueChanges.subscribe(values => {
            });
        
            this.schemaSearch.valueChanges.pipe(
              debounceTime(300),  // Wait for 300ms after typing
              switchMap(searchTerm => {
                let a:Observable<any>=this.filterData(searchTerm,'schemaList')
        
                 a.subscribe(res=>{})
                 return a})).subscribe(filteredList => {
              this.deepCopySchemaList = filteredList;
            });
        
        
            this.sportsCenterSearch.valueChanges.pipe(
              debounceTime(300),  // Wait for 300ms after typing
              switchMap(searchTerm => {
                let a:Observable<any>=this.filterData(searchTerm,'sportsTrainingCenterList')
             a.subscribe(res=>{
             })
                return a})
            ).subscribe(filteredList => {
              this.deepSportsTrainingCenterList = filteredList;
            });
        
        
            this.sportsDisciplineSearch.valueChanges.pipe(
              debounceTime(300),  // Wait for 300ms after typing
              switchMap(searchTerm => {
                let a:Observable<any>=this.filterData(searchTerm,'sportsDisciplineList')
             a.subscribe(res=>{
             })
                return a})
            ).subscribe(filteredList => {
              this.deepCopyDisciplinesList = filteredList;
            });
        
        
            this.stateSearch.valueChanges.pipe(
              debounceTime(300),  // Wait for 300ms after typing
              switchMap(searchTerm => {
                let a:Observable<any>=this.filterData(searchTerm,'stateList')
             a.subscribe(res=>{
             })
                return a})
            ).subscribe(filteredList => {
              this.deepCopyStateList = filteredList;
            });
        
            this.genderSearch.valueChanges.pipe(
              debounceTime(300),  // Wait for 300ms after typing
              switchMap(searchTerm => {
                let a:Observable<any>=this.filterData(searchTerm,'genderList')
             a.subscribe(res=>{
             })
                return a})
            ).subscribe(filteredList => {
              this.deepCopyGenderList = filteredList;
            });
        
    }
    
    onSelectionChange(e: any) {
    }
  
    fetchSchemaList(){
      this.isLoading=true
      this.opsReportService.getSchemeData(this.userData?.role_id,this.userData?.user_id).subscribe({
          next:(res:any)=>{
            this.isLoading=false
             this.deepCopySchemaList = JSON.parse(JSON.stringify(res))
             let selectedData:any=[]
             this.allSelectedListObj.schemaList=res.map((item:any)=>{
              item['isSelected']=true
              item['id']=item.schemeId
              item['name']=item.schemeName
              selectedData.push(item.schemeId)
             return item
            })
  
            this.opsFilterForm.controls['schemaList'].setValue(selectedData);
             this.getAcademyList(selectedData.join())
          },
          error:()=>{
            this.isLoading = false;
          }
        })
    }
     getAcademyList(selectedScemaIds:String){
      this.isLoading=true
      this.opsReportService.getAcademyListData(selectedScemaIds,this.userData?.user_id).subscribe({
          next:(res:any)=>{
            this.isLoading=false
            this.allAcademyList=JSON.parse(JSON.stringify(res))
            this.getAcademy(selectedScemaIds)
          //   this.deepSportsTrainingCenterList = JSON.parse(JSON.stringify(res))
          //   let selectedData:any=[]
          //   this.allSelectedListObj.sportsTrainingCenterList=res.map((item:any)=>{
          //     item['isSelected']=true
          //     item['id']=item.academy_detail_id
          //     item['name']=item.academy_name
          //     selectedData.push(item.academy_detail_id)
          //    return item
          //   })
          //   this.opsFilterForm.controls['sportsTrainingCenterList'].setValue(selectedData);
          //   // let val= this.allSelectedListObj['sportsTrainingCenterList'].filter((item:any)=>item?.isSelected).length ? true :false
          //   // this.opsFilterForm.controls['isTrainingCenterCol'].setValue(val);
          //   if(this.checkDisable('schemaList')){
          //      this.opsFilterForm.get('sportsTrainingCenterList')?.disable();
          //  }else{
          //        this.opsFilterForm.get('sportsTrainingCenterList')?.enable();
          //    }
          //    this.isDisableCheck2('sportsTrainingCenterList','isTrainingCenterCol')
          },
          error:()=>{
            this.isLoading = false;
          }
        })
    }
  
    getAcademy(selectedScemaIds:any){
          const localSchemeIds =   JSON.parse(JSON.stringify(selectedScemaIds)) 
           let a=localSchemeIds.split(',').map((item:any)=> +item)
           let roleDetailIds:any =[]
           this.allSelectedListObj?.schemaList.forEach((item:any) => {
            if(a.includes(item?.schemeId)){
              roleDetailIds.push(item?.roleId)
            }
           })
         
            let res = this.allAcademyList.filter((item:any)=>roleDetailIds.includes(item?.role_detail_id))  
           this.deepSportsTrainingCenterList = JSON.parse(JSON.stringify(res))
            let selectedData:any=[]
            this.allSelectedListObj.sportsTrainingCenterList=res.map((item:any)=>{
              item['isSelected']=true
              item['id']=item.academy_detail_id
              item['name']=item.academy_name
              selectedData.push(item.academy_detail_id)
             return item
            })
            this.opsFilterForm.controls['sportsTrainingCenterList'].setValue(selectedData);
            if(this.checkDisable('schemaList')){
               this.opsFilterForm.get('sportsTrainingCenterList')?.disable();
           }else{
                 this.opsFilterForm.get('sportsTrainingCenterList')?.enable();
             }
             this.isDisableCheck2('sportsTrainingCenterList','isTrainingCenterCol')
    }

     getDisciplineList(){
      this.isLoading=true
      this.opsReportService.getDisciplineListData().subscribe({
          next:(res:any)=>{
            this.isLoading=false
           this.deepCopyDisciplinesList = JSON.parse(JSON.stringify(res))
           let selectedData:any=[]
           this.allSelectedListObj.sportsDisciplineList=res.map((item:any)=>{
             item['isSelected']=true
             item['id']=item.sport_detail_id
             item['name']=item.sport_display_name
             selectedData.push(item.sport_detail_id)
            return item
           })
           this.opsFilterForm.controls['sportsDisciplineList'].setValue(selectedData);
          },
          error:()=>{
            this.isLoading = false;
          }
        })
    }
  
    getStateList(){
      this.isLoading=true
      this.opsReportService.getStateListtData().subscribe({
          next:(res:any)=>{
            this.isLoading=false
           this.deepCopyStateList = JSON.parse(JSON.stringify(res))
           let selectedData:any=[]
           this.allSelectedListObj.stateList=res.map((item:any)=>{
            item['isSelected']=true
            item['id']=item.state_id
            item['name']=item.state_name
            selectedData.push(item.state_id)
           return item
          })
          this.opsFilterForm.controls['stateList'].setValue(selectedData);
          },
          error:()=>{
            this.isLoading = false;
          }
        })
    }
  
    getGenderList(){
      this.isLoading=true
      this.opsReportService.getGenderListData().subscribe({
          next:(res:any)=>{
            this.isLoading=false
           this.deepCopyGenderList = JSON.parse(JSON.stringify(res))
           let selectedData:any=[]
           this.allSelectedListObj.genderList=res.map((item:any)=>{
            item['isSelected']=true
            item['id']=item.gender
            item['name']=item.gender
            selectedData.push(item.gender)
           return item
          })
       
   this.opsFilterForm.controls['genderList'].setValue(selectedData);
          },
          error:()=>{
            this.isLoading = false;
          }
        })
    }
  
  
    getResidentialStatusList(){
      this.isLoading=true
      this.opsReportService.getResidentialStatusData().subscribe({
          next:(res:any)=>{
            this.isLoading=false
            let selectedData:any=[]
           this.deepCopyResidentialStatusList = JSON.parse(JSON.stringify(res))
           this.allSelectedListObj.residentialStatusList=res.map((item:any)=>{
            item['isSelected']=true
            item['id']=item.rs
            item['name']=item.rs
            selectedData.push(item.rs)
           return item
          })
          this.opsFilterForm.controls['residentialStatusList'].setValue(selectedData);
          },
          error:()=>{
            this.isLoading = false;
          }
        })
    }
  
  getOPSSummaryReportList(){
    let athleteOrCoachUrl='Get_OPS_Coach_Summary_Report'
    let payload:any={
      schemeName:this.getColInfo('isSchemaCol') ? this.getOPSFormInfo('schemaList') : '',
      academyName:this.getColInfo('isTrainingCenterCol') ? this.getOPSFormInfo('sportsTrainingCenterList') : '',
      sportsName:this.getColInfo('isDisciplineCol') ? this.getOPSFormInfo('sportsDisciplineList') : '',
      stateName:this.getColInfo('isStateCol') ? this.getOPSFormInfo('stateList') : '',
      gender:this.getColInfo('isGenderCol') ? this.getOPSFormInfo('genderList') : ''
    }
    if(this.isRS==='athlete'){
      athleteOrCoachUrl="Get_OPS_Summary_Report"
      payload['rType']=this.getColInfo('isResidentialCol') ? this.getOPSFormInfo('residentialStatusList') : ''
    }
    this.isLoading=true
    this.opsReportService.getOPSSummaryReportData(payload,athleteOrCoachUrl).subscribe({
        next:(res:any)=>{
          this.isLoading=false
          this.dummyData=[]
          res.forEach((item:any) => {
            this.dummyData.push({
              "SCHEME":item?.schemeName,
              "ACADEMY":item?.academy_name,
              "DISCIPLINE":item?.sport_name,
              "STATE":item?.state_name,
              "MALE":item?.male,
              "FEMALE":item?.feMale,
              "NON RESIDENTIAL":item?.nonResidential,
              "RESIDENTIAL": item?.residential,
              "TOTAL ATHLETE":item?.totalCount,
            })
          });
        this.getHeader(this.opsFilterForm)
          const ELEMENT_DATA: PeriodicElement[] = this.dummyData;
          this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
           this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.tableData.emit(this.dataSource)
              
        },
        error:()=>{
          this.isLoading = false;
        }
      })
  }
  
  getHeader(opsFilterForm:any){
   
    let header:any=[]
    header[8]=  this.isRS==='athlete' ?  'TOTAL ATHLETE' :'TOTAL COACH'
      this.displayedColumns=[]
      for(let formData in opsFilterForm.value){
        if (Array.isArray(opsFilterForm.value[formData])) {
          if(opsFilterForm.value[formData].length){
            switch (formData) {
              case 'schemaList':
                if(this.opsFilterForm.value.isSchemaCol){
                  header[this.fixColIndex.indexOf('SCHEME')]='SCHEME'
                }
                break;
              case 'sportsTrainingCenterList':
                if(this.opsFilterForm.value.isTrainingCenterCol){
                 header[this.fixColIndex.indexOf('ACADEMY')]='ACADEMY'
                }
            
                 break;
              case 'sportsDisciplineList':
                if(this.opsFilterForm.value.isDisciplineCol){
                header[this.fixColIndex.indexOf('DISCIPLINE')]='DISCIPLINE'
                }
          
                break; 
              case 'stateList':
                if(this.opsFilterForm.value.isStateCol){
                 header[this.fixColIndex.indexOf('STATE')]='STATE'
                }
           
                break;
              case 'genderList':
                if(this.opsFilterForm.value.isGenderCol){
                  if(this.opsFilterForm.value[formData].includes('M')){
                  header[this.fixColIndex.indexOf('MALE')]='MALE'
                  };
                  if(this.opsFilterForm.value[formData].includes('F')){
                  header[this.fixColIndex.indexOf('FEMALE')]='FEMALE'
                  };
                }
                break;
              case 'residentialStatusList':
                if(this.isRS==='athlete'){
                  if(this.opsFilterForm.value.isResidentialCol){
                    if(this.opsFilterForm.value[formData].includes('Residential')){
                    header[this.fixColIndex.indexOf('RESIDENTIAL')]='RESIDENTIAL'
                  };
                    if(this.opsFilterForm.value[formData].includes('Non-Residential')){
                    header[this.fixColIndex.indexOf('NON RESIDENTIAL')]='NON RESIDENTIAL'
                  };  
                  }
                }
               
               
                break;             
            }
          }
  
        }
          
      }
      this.displayedColumns=header.filter((item:any)=>{if(item){return item}})

        this.displayCol.emit(this.displayedColumns)
   
  }
  
  getColInfo(controllerName:string){
    return this.opsFilterForm.controls[controllerName].value;
  }
  
  getOPSFormInfo(controllerName:string){
    return this.opsFilterForm.value[controllerName].filter((item:any)=>item !=='all').join()
  }
  
  isButtonDisable(){
    return (!this.opsFilterForm.value.isSchemaCol &&
      !this.opsFilterForm.value.isTrainingCenterCol &&
      !this.opsFilterForm.value.isDisciplineCol &&
      !this.opsFilterForm.value.isStateCol &&
      !this.opsFilterForm.value.isGenderCol &&
      !this.opsFilterForm.value.isResidentialCol ) ? true :false
  }
  
  
  exportData() {
    this.isLoading = true
  let itemsData = this.dataSource?.filteredData
      let headers:any = []
      let fileName = 'coach_current_strength_summary';
      if(this.isRS==='athlete'){
        fileName = 'athlete_current_strength_summary';
      }
        this.displayedColumns.forEach((ele:any) => {
          headers.push(ele)
        });
      itemsData.forEach((res: any) => {
        res['SCHEME']         =  res['SCHEME'] ? res['SCHEME'] : '-',
        res['ACADEMY']        =  res['ACADEMY'] ? res['ACADEMY'] : '-',
        res['DISCIPLINE']     =  res['DISCIPLINE'] ? res['DISCIPLINE'] : '-',
        res['STATE']          =  res['STATE'] ? res['STATE'] : '-',
        res['MALE']           =  res['MALE'] ? res['MALE'] : '-',
        res['FEMALE']         =  res['FEMALE'] ? res['FEMALE'] : '-',
        res['NON RESIDENTIA'] =  res['NON RESIDENTIA'] ? res['NON RESIDENTIA'] : '-',
        res['RESIDENTIAL']    =  res['RESIDENTIAL'] ? res['RESIDENTIAL'] : '-'
        if(this.isRS==='athlete'){
        res['TOTAL ATHLETE']  =  res['TOTAL ATHLETE'] ? res['TOTAL ATHLETE'] : '-'
        }else{
        res['TOTAL COACH']  =  res['TOTAL ATHLETE'] ? res['TOTAL ATHLETE'] : '-'
        }
      
      })
      setTimeout(() => {
        this.opsReportService.downloadFile(itemsData, fileName, headers)
        this.isLoading = false
      }, 500);
  }
  
  checkDisable(keyName:string){
  return !this.allSelectedListObj[keyName].filter((item:any)=>item?.isSelected).length ? true :false
  }
  
  filterData(searchTerm: string,keyName:string): Observable<any[]> {
    let filtered1:any
    if (!searchTerm) {
      this.allSelectedListObj[keyName]
      filtered1= this.allSelectedListObj[keyName]
    }else{
      filtered1 = this.allSelectedListObj[keyName].filter((option:any) =>
        option.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    }
    return new Observable(observer => {
      observer.next(filtered1);
    });
  }
  
  onClickOption(data:any,controllerName:string,id:any,colController:string){
      this.allSelectedListObj[controllerName].forEach((item:any)=>{
        if(item?.id==id){
          item.isSelected = !item.isSelected
          this.ngZone.run(() => {
            this.cdRef.detectChanges(); 
        });
        }
      })
      let selectedData:any= []
     this.allSelectedListObj[controllerName].map((item:any)=>{
      if(item.isSelected){
        selectedData.push(item.id) 
      }
    })
     this.opsFilterForm.controls[controllerName].setValue(selectedData);
     this.isDisableCheck2(controllerName,colController)
     if(controllerName==='schemaList'){
      this.onSelectClose('schemaList')
     }
  }
  
  
  isChecked(controllerName:string): boolean {
    let d=this.opsFilterForm.controls[controllerName].value && this.opsFilterForm.controls[controllerName].value.length
    && this.opsFilterForm.controls[controllerName].value.length ===  this.allSelectedListObj[controllerName].length;
  
    return  d ? true:false
  }
  
  isItemChecked(item:any,listName:string,index:any){
   return this.allSelectedListObj[listName].filter((listObj:any)=>listObj?.id==item)[0]?.isSelected
  }

  trackByFn(index: number, item: any): number {
    return item; // We return the item's unique `id`
  }
  
  toggleSelection(change: any,controllerName:string,colController:string): void {
    if (change?.target?.checked || change?.checked) {
      let selectedData:any= []
      this.allSelectedListObj[controllerName].map((item:any)=>{
        item.isSelected=true
         selectedData.push(item.id) 
       
     })
  
      this.opsFilterForm.controls[controllerName].setValue(selectedData);
    } else {
      this.allSelectedListObj[controllerName].map((item:any)=>{
        item.isSelected=false     
     })
      this.opsFilterForm.controls[controllerName].setValue([]);
    }
  
    this.isDisableCheck2(controllerName,colController)

    if(controllerName==='schemaList'){
    this.onSelectClose('schemaList')
   }
  }
  
  
  onSelectClose(controllerName:string){
    let selectedData:any=[]
    this.allSelectedListObj[controllerName].map((item:any )=>{
      if(item.isSelected){
        selectedData.push(item?.id)
      }
    })
    //  this.getAcademyList(selectedData.join())
    this.getAcademy(selectedData.join())
  }
  
  columncheckBox(controlName: string) {
    this.opsFilterForm.controls[controlName].setValue(this.opsFilterForm.controls[controlName].value)
  }

    isDisableCheck2(keyName:string,controllerName:string){
      let val= this.allSelectedListObj[keyName].filter((item:any)=>item?.isSelected).length ? true :false
     this.opsFilterForm.controls[controllerName].setValue(val);
    if(!this.opsFilterForm.value[keyName]?.length){
      this.opsFilterForm.get(controllerName)?.disable();
    }else{
      this.opsFilterForm.get(controllerName)?.enable();
    }
  
       }
  
      selectFilter(filterName:string,type:string){
         this.filterName=filterName
        this.assighnValue(type)
        // console.log(type)
        // if(type==='isTrainingCenterCol'){
        //   this.onSelectClose('schemaList')
        // }
        
      }

      assighnValue(type:any){       
        switch(type) {
          case 'isSchemaCol':
                this.commanFilterList=this.deepCopySchemaList
            break;
          case 'isTrainingCenterCol':
            this.commanFilterList=this.deepSportsTrainingCenterList
            break;
          case 'isDisciplineCol':
            this.commanFilterList=this.deepCopyDisciplinesList
            break;
          case 'isStateCol':
            this.commanFilterList=this.deepCopyStateList
              break;
          case 'isGenderCol':
            this.commanFilterList=this.deepCopyGenderList
                break;
          case 'isResidentialCol':
            this.commanFilterList=this.deepCopyResidentialStatusList
                  break;
          default:
        }
      }

}
