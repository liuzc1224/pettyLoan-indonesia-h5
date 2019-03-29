import { Component , OnInit , Output , EventEmitter, NgZone  } from '@angular/core';
import { FormGroup , FormBuilder , Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService, ReviewService, TipService, UserActionService, SesssionStorageService } from '../../../service'
import { filter } from 'rxjs/operators';
import { Response } from '../../../share/model' ;
import { ListModelComponent } from '../../../components/list-model/list-model' ;
import { ModalController, IonicPage, NavController } from "ionic-angular";
import { dataFormat, dataFormatRegular, now } from "../../../tools";
import { Before, CombineAll } from "../../../decorators/function.decorator";
import { Observable } from "rxjs";
import { CommonValidator } from "../../../validator";

@IonicPage({
    name : "UserInfoPage"
})
@Component({
    selector: 'user-info',
    templateUrl: 'user-info.html'
})
export class UserInfoComponent implements OnInit {
    parent = this;
    constructor(
        private fb : FormBuilder ,
        private translate : TranslateService ,
        private reviewSer : ReviewService ,
        private msg : TipService ,
        private sgo: SesssionStorageService,
        private modelCtr : ModalController ,
        private nav : NavController ,
        private loadSer : LoadingService ,
        private userAction : UserActionService ,
        private zone: NgZone
    ){};

    ngOnInit(){
        this.initForm() ;
        this.getLang() ;
        this.getUserInfo() ;
    };

    @Output() next : EventEmitter<any> = new EventEmitter() ;

    validForm : FormGroup ;

    initForm(){
        this.validForm = this.fb.group({
            // "usernameShort" : [ null , [Validators.required] ] ,
            "motherName" : [ null , [Validators.required] ] ,
            "educationBackground" : [null , [Validators.required]] ,
            "maritalStatus" : [null , [Validators.required]] ,
            "childNumber" : [null , [Validators.required]] ,
            "residentialType" : [ null , [Validators.required]] ,
            "street" : [null , [Validators.required]] ,
            "block" : [ null , [Validators.required]] ,
            "regent" : [ null , [Validators.required]] ,
            "city" : [null , [Validators.required]] ,
            "provinceCode" : [null , [Validators.required]] ,
            "residentialDuration" : [null , [Validators.required]] ,
            "whatsapp" : [null , [Validators.required]] , //  , Validators.minLength(8) ,CommonValidator.isNumber
            "email" : [ null , [Validators.required] ] ,
            "id" : [null]
        });
    };

    languagePack : Object  ;

    enum_edu : Array< {name : string , value : string } > ;

    enum_marry :  Array< {name : string , value : string } > ;

    enum_child : Array< {name : string , value : string } > ;

    enum_local :  Array< {name : string , value : string } > ;

    enum_provinceCode : Array< {name : string , value : string } > ;
    
    enum_histime : Array< {name : string , value : string } > ;

    getLang(){
        this.translate.stream(['enum'])
            .subscribe(
                lang => {
                    this.enum_edu = lang['enum']['edu'] ;

                    this.enum_marry= lang['enum']['marry'] ;

                    this.enum_child = lang['enum']['child'] ;

                    this.enum_local = lang['enum']['local'] ;

                    this.enum_provinceCode = lang['enum']['provinceCode'] ;

                    this.enum_histime = lang['enum']['histime'] ;
                }
            )
    };

    @Before(function(){
        return new Observable( obsr => {

            if(!this.validForm.valid){
                this.msg.require() ;
                return ;
            };

            obsr.next("success") ;
        })
    })
    @Before(function(){
        return new Observable( obsr => {
            let obj = this.riskTime ;
            obj['nextStep'] = now() + "," ;
            this.userAction.userInfo(obj) ;
            obsr.next("success") ;
        })
    })
    @CombineAll()
    nextBtn($event){
        const data = this.validForm.value ;
        // data['birthday'] = dataFormatRegular(data['birthday']) ;
        let el = <HTMLButtonElement>$event.target ;

        el.disabled = true ;

        let model = this.loadSer.deal() ;

        model.present() ;

        this.reviewSer.saveUserInfo(data)
            .pipe(
                filter(
                    (res : Response) => {

                        if(res.success === false){
                            this.msg.operateFail(res.message) ;
                        };

                        model.dismiss() ;

                        el.disabled = false ;

                        return res.success === true ;
                    }
                )
            )
            .subscribe(
                ( res : Response ) => {
                    this.setListStatus(1)
                    this.slideTo("UserInComePage") ;
                }
            );
    };

    resMark : boolean = false ;

    getUserInfo(){
        this.reviewSer.getUserInfo()
            .pipe(
                filter(
                    ( res : Response ) => {
                        this.zone.run(() => {
                            this.resMark = true ;
                        });
                        if(res.success === false){
                            this.msg.operateFail(res.message) ;
                        };


                        return res.success === true && res.data != null ;
                    }
                )
            )
            .subscribe(
                (res : Response) => {
                    res.data['birthday'] = dataFormatRegular(res.data['birthday']) ;
                    this.validForm.patchValue(< Object >res.data) ;
                }
            );
    };

    showModel( value :string , itemName : string ){
        this.makeRecord(itemName)
        let data = this[value] ;

        let model = this.modelCtr.create( ListModelComponent , { list : data } ) ;

        model.onDidDismiss(data => {
            if(data){
                let obj = {} ;
                obj[itemName] = data.value ;
                this.validForm.patchValue(obj) ;
                let el =  <HTMLInputElement>document.querySelector(`#${itemName}`) ;
                el.value = data.name ;
            };
        });
        model.present() ;
    };

    slideTo( name : string | boolean, step?){
        if(name !== false)
            this.nav.push(<string>name) ;

        if(step !== undefined){
            let obj = this.riskTime ;
            obj['stepId'] = step ;
            obj['step'] = now() + "," ;
            this.userAction.userInfo(obj) ;
        };
    };

    back(par){
        let obj = par.riskTime ;
        obj['topBack'] = now() + "," ;
        par.userAction.userInfo(obj) ;
        par.nav.pop() ;
        // par.slideTo('certificationPage');
    };

    riskTime = {
        "birthday": "",
        "birthplace": "",
        "bottomBack": "",
        "city": "",
        "street": "",
        "educationBackground": "",
        "fatherName": "",
        "gender": "",
        "homeTelephone": "",
        "homeTelephoneAreaCode": "",
        "maritalStatus": "",
        "motherName": "",
        "nextStep": "",
        "residentialDuration": "",
        "residentialPostcode": "",
        "provinceCode": "",
        "step": "",
        "stepId": "",
        "topBack": "",
        "usernameShort": ""
    };

    makeRecord(name : string){
        this.riskTime[name] += now() + "," ;
    };
    setListStatus(num){
        let listStatus = this.sgo.get('listStatus');
        listStatus.person.status = num;
        this.sgo.set('listStatus',listStatus)
    }
};

