import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SesssionStorageService, UserActionService } from "../../service";
import { CommonValidator } from "../../validator";
import { now } from "../../tools/date";
import { After, Before, CombineAll } from "../../decorators/function.decorator";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { Response } from "../../share/model/index";
@IonicPage({
  name: "RegistPage"
})
@Component({
  selector: "page-regist",
  templateUrl: "regist.html"
})
export class RegistPage implements OnInit {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private sgo: SesssionStorageService,
    private userAction: UserActionService
  ) {}

  ngOnInit() {
    this.validForm = this.fb.group({
      phone: [null, [Validators.required, CommonValidator.isCpfValid]],
      mail: [null, [Validators.required, CommonValidator.isMail]],
      cpf: [null, [Validators.required, CommonValidator.isCpfValid]]
    });
  }

  back() {
    let obj = this.riskTime;

    obj["nextStep"] += now() + ",";

    this.userAction.registTime(obj);

    this.navCtrl.pop();
  }

  validForm: FormGroup;

  first: boolean = true;

  access() {
    this.riskTime["check"] += now() + ",";
    this.first = !this.first;
  }

  login() {
    this.sgo.set("loginGuide", "hide");
    this.navCtrl.push("LoginPage");
  }

  @Before(function() {
    // 检测改手机号是否注册
    return new Observable(obsr => {
      let data = this.validForm.value;
      let code = this.sgo.get("areaCode");
      this.userSer
        .eixt({
          areaCode: code,
          phoneNumber: data.phone,
          cpf: data.cpf
        })
        .pipe(
          filter((res: Response) => {
            if (res.success === false) {
              this.msg.operateFail(res.message);
            }
            return res.success === true;
          })
        )
        .subscribe((res: Response) => {
          if (res.code == 0) {
            obsr.next("success");
          } else {
            this.msg.operateFail("O número de celular já está cadastrado");
          }
        });
    });
  })
  @After(function() {
    if (!this.validForm.valid || this.first == false) {
      this.msg.require();
      return;
    }
    return new Observable(obsr => {
      obsr.next("success");
    });
  })
  @Before(function() {
    let obj = this.riskTime;
    obj["nextStep"] += now() + ",";
    this.userAction.registTime(obj);
    return new Observable(obsr => {
      obsr.next("success");
    });
  })
  @Before(function() {
    //getChanelId
    return new Observable(obsr => {
      this.sysSer.getChanelId().subscribe(res => {
        obsr.next("success");
      });
    });
  })
  @Before(function() {
    //getChanelId
    return new Observable(obsr => {
      this.sysSer.getTimeZome().subscribe(res => {
        obsr.next("success");
      });
    });
  })
  @CombineAll()
  postCode($event) {
    let data = this.validForm.value;
    // let chanelId = this.sgo.get('chanelId') ;
    let timezone = this.sgo.get("timezone");
    data["chanelId"] = "GooglePlay";
    data["timeZone"] = timezone;

    this.sgo.set("registInfo", data);

    let code = this.sgo.get("areaCode");

    const postData = {
      areaCode: code,
      phoneNumber: data.phone,
      verificationType: 1
    };

    this.sgo.set("registMark", "regist");
    this.navCtrl.push("SetPassPage");
  }

  showLoad(url) {
    this.navCtrl.push(url);
  }

  riskTime: Object = {
    bottomBack: "",
    check: "",
    email: "",
    login: "",
    phoneNumber: "",
    register: "",
    topBack: "",
    cpf: ""
  };
  //注册获取定位权限只拉去一次
  getLocatefirst: boolean = true;

  makeRecord(type: string) {
    const nowTimeStamp = now();
    let __this = this;
    this.riskTime[type] += nowTimeStamp + ",";
  }
}
