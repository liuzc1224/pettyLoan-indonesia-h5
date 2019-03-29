import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { detaildService } from '../../service';
import { TipService } from '../../service';
import { Response } from '../../share/model';
import { dataFormat } from '../../tools';


/**
 * Generated class for the InvestDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'InvestDetail'
})
@Component({
  selector: 'invest-detail',
  templateUrl: 'invest-detail.html',
  providers: [detaildService]
})
export class InvestDetailPage {

  orderId: number;
  pageInfo: object;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private detaildService: detaildService,
    private TipService: TipService,

  ) {
    this.orderId = navParams.get('orderId');
  }

  ngOnInit() {
    this._initPage();
  }

  ionViewDidLoad() {
    document.title = 'detalle'
  }

  _initPage() {
    let param = this.orderId;

    if ( !param  ) {
      if (window['JsInterface']) {
        let data = window['JsInterface']['getOrderDetail']();
        data = data && data !== '{}' ? JSON.parse(data)['id'] : null;
        param = data;
      }
    }
    this.detaildService.get(1678)
      .subscribe(
        (res: Response) => {
          if (res.success) {
            res.data['overDueRateMoney'] = res.data['overDueRateMoney'] || "0.00";
            res.data['couponAmount'] = res.data['couponAmount'] ? "-" + res.data['couponAmount'] : "0";
            res.data['currentRepay'] ? res.data['currentRepay'] : '0.00';
            res.data['beforeCouponRepayAmount'] ? res.data['beforeCouponRepayAmount'] : '0.00';
            res.data['borrowTime'] = dataFormat(res.data['borrowTime']);
            res.data['repayTime'] = dataFormat(res.data['repayTime']);
            this.pageInfo = (<object>res.data);
          } else {
            this.TipService.fetchFail(res.message);
          }
        }
      )
  }

  goaboutmoney(){
    this.navCtrl.push('AboutMoney');
  }

  copy(txt){
    if (window['JsInterface']) {
      window['JsInterface']['cutText'](txt);
    }
  }

}
