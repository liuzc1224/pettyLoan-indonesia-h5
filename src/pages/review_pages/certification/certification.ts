import { Component, OnInit } from "@angular/core";
import {
  LoanService,
  SesssionStorageService,
  TipService,
  UserActionService,
  OrderService,
  UploadRisk,
  LoadingService
} from "../../../service";
import { filter } from "rxjs/operators";
import { Response } from "../../../share/model";
import { IonicPage, NavController } from "ionic-angular";
import { Before, CombineAll } from "../../../decorators/function.decorator";
import { Observable } from "rxjs";
import { now } from "../../../tools";
import bridge from "../../../tools/bridge";
@IonicPage({
  name: "certificationPage"
})
@Component({
  selector: "certification",
  templateUrl: "certification.html"
})
export class CertificationComponent implements OnInit {
  parent = this;
  constructor(
    public navCtrl: NavController,
    private loan: LoanService,
    private msg: TipService,
    private nav: NavController,
    private sgo: SesssionStorageService,
    private orderSer: OrderService,
    private userAction: UserActionService,
    private uploadRisk: UploadRisk,
    private loadSer: LoadingService
  ) {}

  listStatus: Object;
  showShop: Boolean = false;
  submitAllow: Boolean = false;
  phonesList: Array<String> = ['0811', '0812', '0813', '0814', '0815', '0816', '0817', '0818', '0819', '0821', '0822', '0823', '0851', '0852', '0855', '0856', 
                '0857', '0858', '0859', '0877', '0878']
  ngOnInit() {
    if ( !this.sgo.get('listStatus')){
      this.sgo.set('listStatus',{
        identify: {
          status: 0
        },
        person: {
          status: 0
        },
        work: {
          status: 0
        },
        relation: {
          status: 0
        },
        shop: {
          status: 0
        },
      })
    }

    this.ishowShop();
    this.listStatus = this.sgo.get('listStatus');
    // 定时刷新每个页面的输入状态，解决在点击返回按钮时页面不刷新无法拿到最新输入情况
    var that = this
    var interval = setInterval(function() {
      that.getListStatus();
    }, 1000);
  }
  ishowShop(){
    let phone:String = this.sgo.get('loginInfo').phoneNumber;
    phone = phone.slice(0,4)
    if (this.phonesList.indexOf(phone) >= 0 ) {
      this.showShop = true
      this.sgo.set('showShop',1)
    } else {
      this.setListStatus(1)
      this.sgo.set('showShop',0)
    }
  }
  getListStatus(){
    this.listStatus = this.sgo.get('listStatus');
    if(this.listStatus['identify'].status&&this.listStatus['person'].status&&
       this.listStatus['work'].status&&this.listStatus['relation'].status&&this.listStatus['shop'].status){
      this.submitAllow = true
    }
  }
  buttonClick(type: any){
    let pageList = ['UserAuthPage','UserInfoPage','UserInComePage','ContactPage','carrierPage']
    this.nav.push(pageList[type]);
  }
  
  @Before(function() {
    let model = this.loadSer.deal(" Pemuatan");
    model.present();
    return new Observable(obsr => {
      console.log("打开加载框");
      obsr.next(model);
    });
  })
  @Before(function($event, $model) {
    return new Observable(obsr => {
      this.uploadRisk.riskInfo().subscribe(res => {
        console.log('getDviceDetail成功：'+res)
        if (res["code"] === 0) {
          obsr.next("success");
        } else {
          this.msg.fetchFail(res.message);
          $model.dismiss();
        }
      });
    });
  })
  @CombineAll()
  nextBtn($event, model) {
    return new Observable(obsr => {
      console.log("开始创建订单");
      this.createOrder(model, $event, obsr);
    });
  }
  createOrder(model, el: HTMLButtonElement, obsr) {
    const loginInfo = this.sgo.get("loginInfo");

    // const loanPurpose = this.sgo.get("loanPurpose");

    const postData = {
      loanPurpose: '',
      userPhone: loginInfo["phoneNumber"]
    };

    this.orderSer
      .create(postData)
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }


          el.disabled = false;
          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        model.dismiss();
        obsr.next("success");
        this.sgo.remove(["loanPurpose"]);
        bridge["goHome"]();
        // this.nav.setRoot(HomePage) ;
      });
  }

  back() {
    bridge["goBack"](this.listStatus);
  }
  setListStatus(num){
      let listStatus = this.sgo.get('listStatus');
      listStatus.shop.status = num;
      this.sgo.set('listStatus',listStatus)
  }
}
