import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { OrderService } from "../../service/order/order.service";
import { TipService } from "../../service";
@IonicPage({
  name: "StageOrderDetail"
})
@Component({
  selector: "page-stage-order-detail",
  templateUrl: "stage-order-detail.html"
})
export class StageOrderDetailPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public orderService: OrderService,
    private msg: TipService
  ) {
    this.id = this.navParams.get("id");
  }
  id: string;
  listData: object;
  ngOnInit() {
    this.getInfo();
  }
  getInfo() {
    this.orderService.getStageOrderInfo(this.id).subscribe(res => {
      if (res["success"] && res["data"]) {
        this.listData = res["data"];
        for (let i = 0; i < this.listData["length"]; i++) {
          switch (this.listData[i]["repayStatus"]) {
            case 4: {
              this.listData[i].repayStatusTxt = "Pago e quitado"; //已还已结清
              break;
            }
            case 6: {
              this.listData[i].repayStatusTxt = "Vencido e quitado"; //逾期已结清
              break;
            }
          }
        }
      } else {
        this.msg.fetchFail(res["message"]);
      }
    });
  }
}
