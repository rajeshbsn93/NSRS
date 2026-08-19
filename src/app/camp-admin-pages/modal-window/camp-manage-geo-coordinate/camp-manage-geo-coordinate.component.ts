import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "src/app/_common/material.module";
import { CampAdminService } from "src/app/_common/services/camp-services/camp-admin.service";
import { AlertService } from "src/app/_common/services/common-services/alert.service";
import { LoaderComponent } from "src/app/standalone_components/loader/loader.component";

@Component({
    selector:'app-camp-manage-geo-coordinate',
    templateUrl:'./camp-manage-geo-coordinate.component.html',
    styleUrls:['./camp-manage-geo-coordinate.component.css'],
    standalone:true,
    imports:[CommonModule,ReactiveFormsModule,MaterialModule,LoaderComponent]
})
export class CampManageGeoCoordinateComponent implements OnInit{
    campForm!:FormGroup;
    geoLocationRowData:any;
    geoLocationMasterData:any;
    geoLocationVenueData:Array<any> = [];
    loader:boolean = false;

    constructor(public activeModal:NgbActiveModal,private fb:FormBuilder,private campAdminService:CampAdminService,
        private alertService:AlertService){}
    ngOnInit(): void {
        // console.log(this.geoLocationRowData)
        this.getGeoLocationMaster(this.geoLocationRowData.state_id);
        this.campForm = this.fb.group({
            campArray:this.fb.array([])
        });
        // this.campArray.push(this.addCampArray(this.geoLocationRowData,0))
        if(this.geoLocationRowData.campGeoLocations.length >0){
            for(let i=0;i<this.geoLocationRowData.campGeoLocations.length;i++){
                this.campArray.push(this.addCampArray(this.geoLocationRowData,i))
            } 
        } else{
            this.campArray.push(this.addCampArray(this.geoLocationRowData,0)) 
        }      
    }
    getGeoLocationMaster(stateId:number){
        this.loader = true;
        this.campAdminService.geoLocationDetail(stateId).subscribe({
            next:(response)=>{
                this.loader = false;
                this.geoLocationMasterData = response;
            },
            error:(err)=>{
                this.loader = false;
                console.error(err)
            }
        })
    }
    getvenueDetail(location_id:number,index:number){
        if(location_id){
            this.loader = true;
            this.campAdminService.venueDetail(location_id).subscribe({
                next:(response)=>{
                    this.loader = false;
                    //console.log(response);
                    this.geoLocationVenueData[index] = response
                },
                error:(err)=>{
                    console.error(err)
                }
            })
        }
    }
    changeGeoCoordinate(event:any,index:number){
        // console.log(event,index)        
        this. getvenueDetail(event,index);
        this.geoLocationMasterData.filter((x:any)=>{
            if(x.id==event){
                this.campArray.controls[index].get('location')?.setValue(x.location_name);
            }
        })
    }
    changeVenue(event:any,index:number){ 
        this.geoLocationVenueData[index].filter((x:any)=>{
            if(x.venue_id==event){
                //console.log(x)
                this.campArray.controls[index].get('latitude')?.setValue(x.latitude + ',' + x.longitude);
                this.campArray.controls[index].get('longitude')?.setValue(x.longitude);
                // this.campArray.controls[index].get('location')?.setValue(x.location_name);
            }
        })       
    }
    checkLocation(index:number){
        if(this.campArray.controls[index].get('location')?.value == null){
            this.alertService.swalPopWarning('Please Select Location!')
        }
    }
    get campArray():FormArray{
        return this.campForm.get('campArray') as FormArray
    }
    addCampArray(rowData:any,index:number):FormGroup{
       this.getvenueDetail(rowData?.campGeoLocations[index]?.location_id,index);
        return this.fb.group({
            sport:[rowData ==null ? this.geoLocationRowData?.sport_detail_id :rowData?.sport_detail_id],
            state:[rowData?.state_id ==null ? this.geoLocationRowData?.state_id :rowData?.state_id],
            gender:[rowData?.campGeoLocations[index]?.gender],
            location_id:[rowData?.campGeoLocations[index]?.location_id ? rowData?.campGeoLocations[index]?.location_id : '',Validators.required],
            venue_id:[rowData?.campGeoLocations[index]?.venue_id ? rowData?.campGeoLocations[index]?.venue_id : '', Validators.required],
            latitude:[{value:rowData?.campGeoLocations[index]?.latitude==undefined || null ? '' : rowData?.campGeoLocations[index]?.latitude + ',' + rowData?.campGeoLocations[index]?.longitude, disabled:true}],
            longitude:[rowData?.campGeoLocations[index]?.longitude == undefined || null ? '' : rowData?.campGeoLocations[index]?.longitude],
            location:[rowData?.campGeoLocations[index]?.location],
            radius:[rowData?.campGeoLocations[index]?.radius],
            type:['Camp'],
            start_time:[rowData?.campGeoLocations[index]?.start_time ? rowData?.campGeoLocations[index]?.start_time.split('T')[1] : rowData?.campGeoLocations[index]?.start_time],
            end_time:[rowData?.campGeoLocations[index]?.end_time ? rowData?.campGeoLocations[index]?.end_time.split('T')[1] : rowData?.campGeoLocations[index]?.end_time],
        })
    }
    add(){
        // this.campArray.push(this.addCampArray(this.geoLocationRowData,this.campArray.length))
        this.campArray.push(this.addCampArray(null,this.campArray.length))
    }
    removeAddMultiTagArray(index:number){
        this.campArray.removeAt(index);
        this.campArray.updateValueAndValidity();
    }
    
    changeStartTime(event:any,EndTimeVal:any,index:number){
        //console.log('event.target.value',event.target.value)
        if(event.target.value > EndTimeVal){
            this.campArray.controls[index].get('end_time')?.reset('')
        }else{
            if(event.target.value == undefined || event.target.value == null || event.target.value==''){
                this.campArray.controls[index].get('end_time')?.reset('')
            }
        }
    }
    changeEndTime(event:any,startTimeVal:any,index:number){
        if(event.target.value < startTimeVal){
            this.alertService.swalPopWarning('End time must be greater than start time!')
            this.campArray.controls[index].get('end_time')?.reset()
        }else{
            if(this.campArray.controls[index].get('start_time')?.value ==null || this.campArray.controls[index].get('start_time')?.value ==''){
                this.campArray.controls[index].get('end_time')?.reset()
            }
        }
    }
    checkStartTime(index:number){
        if(this.campArray.controls[index].get('start_time')?.value ==null){
            this.alertService.swalPopWarning('Select start time');
        }
    }
    save(){
        for(let i=0; i<this.campArray.length;i++){
            this.campArray.controls[i].value.latitude= this.campArray.controls[i].getRawValue().latitude.split(',')[0]
            this.campArray.controls[i].value.radius= Number(this.campArray.controls[i].value.radius);
            this.campArray.controls[i].value.sport= this.campArray.controls[i].value.sport.toString();
            delete this.campArray.controls[i].value.state
        }
        //console.log(this.campArray.value)
        //console.log(this.campArray.length)
        if(this.campArray.valid){
            if(this.campArray.length > 1){
                // console.log('Multiple entry')
                for(let i=0; i<this.campArray.length; i++){
                    for(let j=i+1;j<this.campArray.length;j++){
                        if(this.campArray.controls[i].value.gender === this.campArray.controls[j].value.gender && this.campArray.controls[i].value.location_id === this.campArray.controls[j].value.location_id &&
                            this.campArray.controls[i].value.radius === this.campArray.controls[j].value.radius &&
                            this.campArray.controls[i].value.start_time.split(':')[0] === this.campArray.controls[j].value.start_time.split(':')[0] &&
                            this.campArray.controls[i].value.start_time.split(':')[1] === this.campArray.controls[j].value.start_time.split(':')[1] &&
                            this.campArray.controls[i].value.end_time.split(':')[0] === this.campArray.controls[j].value.end_time.split(':')[0] &&
                            this.campArray.controls[i].value.end_time.split(':')[1] === this.campArray.controls[j].value.end_time.split(':')[1]){
                                this.alertService.swalPopWarning('Duplicate entry found!');
                                return 
                        }
                    }
                }
                this.saveGeoLocation()
            }else{
                // console.log('single Entry')
                this.saveGeoLocation();
            }
        }else{
            this.campArray.markAllAsTouched();
        }
        
    }
    saveGeoLocation(){
        this.loader = true;
        this.campAdminService.SaveCampGeoLocations(this.geoLocationRowData.camp_detail_id,this.campArray.value).subscribe({
            next:(response)=>{
                this.loader = false;
                if(response){
                    this.activeModal.close(true)
                    this.alertService.swalPopSuccess("Save Successfully")
                }
            },
            error:(err)=>{
                this.loader = false;
                console.error(err);
            }
        })
    }
}