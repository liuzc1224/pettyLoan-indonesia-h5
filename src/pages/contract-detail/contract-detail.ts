import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  AccountService, TipService
} from "../../service";
import { Response } from "../../share/model";
import { filter } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
@IonicPage({
  name: "contractDetailPage"
})
@Component({
  selector: "contract-detail",
  templateUrl: "contract-detail.html"
})
export class contractDetailPage implements OnInit {
  parent = this
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private accountSer: AccountService,
    private msg: TipService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getLang();
  }

  back(par) {
    par.navCtrl.pop();
  }
  info: Object = {
    appName: '',
  };
  orderId: any; //订单id
  getLang() {
    this.orderId = this.navParams.get("orderId");
    this.translate.stream(["about"]).subscribe(res => {
      this.getContractParam()
    });
  }
  getContractParam(){
    this.accountSer
      .getContractInfo(this.orderId)
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        if (res.data){
          this.info = res.data
        }
      });
  }
}
