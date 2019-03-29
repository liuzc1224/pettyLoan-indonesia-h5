import { Component, OnInit, NgZone } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImgService, LoadingService, ReviewService, TipService, UserActionService, SesssionStorageService } from '../../../service';
import { TranslateService } from "@ngx-translate/core";
import { filter } from "rxjs/operators";
import { Response } from "../../../share/model";
import { ListModelComponent } from '../../../components/list-model/list-model' ;
import { IonicPage, NavController, ModalController } from "ionic-angular";
import { Before, CombineAll } from "../../../decorators/function.decorator";
import { Observable } from "rxjs";
import { now } from "../../../tools";
import bridge from "../../../tools/bridge";
@IonicPage({
  name: "carrierPage"
})
@Component({
  selector: "carrier",
  templateUrl: "carrier.html"
})
export class CarrierComponent implements OnInit {
  parent = this;
  constructor(
      private fb : FormBuilder ,
      private img : ImgService ,
      private reviewSer : ReviewService ,
      private translate: TranslateService,
      private msg : TipService ,
      private nav : NavController ,
      private modelCtr : ModalController ,
      private loadSer : LoadingService ,
      private userAction : UserActionService,
      private sgo: SesssionStorageService,
      private zone: NgZone
  ){};
  isSending:boolean = false;
  sendSuccess:Boolean = false;
  enum_review: any;
  check:boolean = false;
  enum_edu : Array< {name : string , value : string } > ;
  validForm:FormGroup
  phone:Number = 0;
  sendMsg:String = 'Kirim';
  inputValue: String = ''
  opearatorType: Number = 1;
  timer
  ngOnInit(){
      this.initForm() ;
      this.getLang();
  };

  initForm(){
    this.validForm = this.fb.group({
      "opearatorType" : [ null , [Validators.required] ]
  });
    this.phone = this.sgo.get('loginInfo').phoneNumber
    this.enum_edu = [{
      name: 'TELKCOMSEL', value: '1'
    },{
      name: 'XL', value: '2'
    },{
      name: 'INDOSAT', value: '3'
    }]
  };
  getLang() {
    this.translate.stream(["review", "tip"]).subscribe(lang => {
      this.enum_review = lang["review"]["carrier"];
    });
  }
  send(){
    if ( !this.validForm.value.opearatorType ) {
      this.msg.operateFail(this.enum_review['chooseShop']) ; // 请选择运营商
      return false
    }
    clearInterval(this.timer);
    var time=6;
    var that=this;
    that.isSending=true;
    that.sendMsg=this.enum_review['vtime']+(time)+this.enum_review['second'];
    this.timer=setInterval(function(){
        console.log(time);
        if(time<=1){
            that.sendMsg="";
            that.sendMsg="Kirim ulang";
            that.isSending=false;

        }else {
            that.isSending=true;
            that.sendMsg="";
            time--;
            that.sendMsg=this.enum_review['vtime']+(time)+this.enum_review['second'];
        }
    },1000);
    this.sendMsgFn()
  }
  sendMsgFn(){
    let data = {
      "confirm": true,
      "opearatorType": this.validForm.value.opearatorType
    };
    this.reviewSer
    .getSMSCode(data)
    .pipe(
      filter((res: Response) => {
        if (res.success === false) {
          this.msg.operateFail(res.message);
        }
        return res.success === true;
      })
    )
    .subscribe((res: Response) => {
      this.msg.operateSuccess('Sukses');
      this.sendSuccess = true
    });
  }
  nextBtn(){

    let model = this.loadSer.deal();

    model.present() ;
    let data = {
      smsCode: this.inputValue
    }
    this.reviewSer
    .checkSMSCode(data)
    .pipe(
      filter((res: Response) => {
        if (res.success === false) {
          this.msg.operateFail(res.message);
        }
        model.dismiss() ;

        return res.success === true;
      })
    )
    .subscribe((res: Response) => {
      this.setListStatus(1);
      this.nav.push("certificationPage") ;
    });
  }
  showModel( value :string , itemName : string ){
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
  access() {
    this.check = !this.check;
  }
  back(par) {
    par.nav.pop();
  }
  setListStatus(num){
    let listStatus = this.sgo.get('listStatus');
    listStatus.shop.status = num;
    this.sgo.set('listStatus',listStatus)
  }
}

