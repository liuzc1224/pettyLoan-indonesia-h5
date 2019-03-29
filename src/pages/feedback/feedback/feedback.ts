import {Component, NgZone} from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Before, CombineAll } from "../../../decorators/function.decorator";
import { RegGroup } from "../../../validator/regGroup/reg";
import { Observable } from "rxjs";
import { SesssionStorageService } from "../../../service/common/storage";
import {LoadingService, TipService, UserService, LoanService, ImgService} from "../../../service";
import { Response } from "../../../share/model";
import { filter } from "rxjs/operators";
import { HomePage } from "../../home/home";
import { Events } from "ionic-angular";
import bridge from '../../../tools/bridge';
/**
 * Generated class for the InvatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "FeedbackPage"
})
@Component({
  selector: "page-feedback",
  templateUrl: "feedback.html"
})
export class InvatePage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sgo: SesssionStorageService,
    private user: UserService,
    private img : ImgService ,
    private msg: TipService,
    private loan: LoanService,
    private loadSer: LoadingService,
    private events: Events,
    private zone: NgZone
  ) {}

  invateCode: string = null;
  inputValue: string = null;
  imgData: Array<string>=[];
  back() {
    this.navCtrl.pop();
  }
  @Before(function($event) {
    let code = this.invateCode;
    return new Observable(obsr => {
      if (RegGroup.invateCode(code) && code) {
        obsr.next("success");
      }
      if (!RegGroup.invateCode(code) && code) {
        this.msg.operateFail("Insira código do convite correto");
      }
    });
  })
  @CombineAll()
  nextBtn($event: any, pass: boolean) {
    let postData = this.sgo.get("registForm");

    let model = this.loadSer.deal();

    model.present();

    if (this.invateCode && pass != true)
      postData["invitationCode"] = this.invateCode;

    this.user
      .regist(postData)
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          model.dismiss();
          $event.target.disabled = false;

          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.events.publish("login", res.data);
        this.sgo.set("loginInfo", res.data);
        this.sgo.remove(["registForm", "registMark"]);
        this.navCtrl.setRoot(HomePage);
      });
  }

  nextBtn2($event: any) {
    let postData = this.sgo.get("registForm");

    let model = this.loadSer.deal();

    model.present();

    this.user
      .regist(postData)
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          model.dismiss();
          $event.target.disabled = false;

          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.events.publish("login", res.data);
        this.sgo.set("loginInfo", res.data);
        this.sgo.remove(["registForm", "registMark"]);
        this.navCtrl.setRoot(HomePage);
      });
  }
  add(){
    this.take().subscribe(data => {
      console.log("照片回调----imgchange---", data);
      if (data["code"] === 1) {
        const base64 = "data:image/jpeg;base64," + data["imageBase64"];

        if(this.imgData.indexOf(base64)==-1){
          this.zone.run(() => {
            this['imgData'].push(base64);
          });
        }
        //成功
      } else if (data["code"] === 2) {
        //取消
      } else if (data["code"] === 0) {
        //拒绝
      }
    });

  }
  take(){
    return new Observable(resove => {
      bridge["openGallary"](null, res => {
        resove.next(JSON.parse(res));
      });
    });
  }
  sub(){
    let fromData=new FormData();
    let $this=this;
    if(this.imgData.length>0){
      this.imgData.forEach(function(item){
        const file = $this.img.base64ToImg(<string>item);
        fromData.append('images',file);
      });
    }



    // if(this.imgData){
    //   this.fromData.append("images","");
    // }
    fromData.append("title","体验反馈");
    fromData.append("phoneNumber",this.sgo.get('loginInfo')["phoneNumber"]);
    fromData.append("content",this.inputValue);
    // let data={
    //   title : '体验反馈',
    //   phoneNumber : this.sgo.get('loginInfo')["phoneNumber"],
    //   content : this.inputValue,
    //   images : this.fromData
    // };
    console.log(fromData);
    this.loan
      .feedback(fromData)
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            // this.msg.operateFail(res.message);
            this.msg.operateFail("Falha ao enviar")
          }
          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.msg.operateWarn("Sucesso de enviar");
        // this.loadSer.deal("Sucesso de enviar");
        setTimeout(function () {
          bridge["goBack"]();
        },1000)

      });
  }
  imgClick(data){
    console.log(data);
    this.imgData = this.imgData.filter(function(val){
      return val!=data;
    });
  }
}
