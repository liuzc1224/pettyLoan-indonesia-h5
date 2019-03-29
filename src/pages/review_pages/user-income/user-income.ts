import { Component, OnInit, NgZone } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import {
  ImgService,
  LoadingService,
  ReviewService,
  TipService,
  UserActionService,
  SesssionStorageService
} from "../../../service";
import { filter } from "rxjs/operators";
import { Response } from "../../../share/model";
import { ListModelComponent } from "../../../components/list-model/list-model";
import { IonicPage, ModalController, NavController } from "ionic-angular";
import { now } from "../../../tools";
import { Before, CombineAll } from "../../../decorators/function.decorator";
import { Observable } from "rxjs";

@IonicPage({
  name: "UserInComePage"
})
@Component({
  selector: "user-income",
  templateUrl: "user-income.html"
})
export class UserIncomeComponent implements OnInit {
  parent = this;
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private reviewSer: ReviewService,
    private msg: TipService,
    private img: ImgService,
    private sgo: SesssionStorageService,
    private modelCtr: ModalController,
    private nav: NavController,
    private load: LoadingService,
    private userAction: UserActionService,
    private zone: NgZone
  ) {}

  validForm: FormGroup;

  ngOnInit() {
    this.initForm();
    this.getLang();
    this.getWork();
  }

  languagePack: Object;

  incomeFlag: any;

  enum_socialRole: Array<{ name: string; value: string }>;

  enum_income: Array<{ name: string; value: string }>;

  enum_incomeType: Array<{ name: string; value: string }>;

  enum_payDate: Array<{ name: string; value: string }> = [
    { name: "Dia 1", value: "1" },
    { name: "Dia 2", value: "2" },
    { name: "Dia 3", value: "3" },
    { name: "Dia 4", value: "4" },
    { name: "Dia 5", value: "5" },
    { name: "Dia 6", value: "6" },
    { name: "Dia 7", value: "7" },
    { name: "Dia 8", value: "8" },
    { name: "Dia 9", value: "9" },
    { name: "Dia 10", value: "10" },
    { name: "Dia 11", value: "11" },
    { name: "Dia 12", value: "12" },
    { name: "Dia 13", value: "13" },
    { name: "Dia 14", value: "14" },
    { name: "Dia 15", value: "15" },
    { name: "Dia 16", value: "16" },
    { name: "Dia 17", value: "17" },
    { name: "Dia 18", value: "18" },
    { name: "Dia 19", value: "19" },
    { name: "Dia 20", value: "20" },
    { name: "Dia 21", value: "21" },
    { name: "Dia 22", value: "22" },
    { name: "Dia 23", value: "23" },
    { name: "Dia 24", value: "24" },
    { name: "Dia 25", value: "25" },
    { name: "Dia 26", value: "26" },
    { name: "Dia 27", value: "27" },
    { name: "Dia 28", value: "28" },
    { name: "Dia 29", value: "29" },
    { name: "Dia 30", value: "30" },
    { name: "Dia 31", value: "31" }
  ];

  getLang() {
    this.translate.stream(["enum"]).subscribe(lang => {
      this.enum_socialRole = lang["enum"]["socialRole"];

      this.enum_income = lang["enum"]["income"];
      
      this.enum_provinceCode = lang['enum']['provinceCode'] ;

      this.enum_incomeType = lang["enum"]["incomeType"];
    });
  }

  postData: FormData = new FormData();

  initForm() {
    this.validForm = this.fb.group({
      socialIdentityCode: [null, [Validators.required]],
      monthlyIncome: [null, [Validators.required]],
      companyName: [null, [Validators.required]],
      street : [null , [Validators.required]] ,
      block : [ null , [Validators.required]] ,
      regent : [ null , [Validators.required]] ,
      city : [null , [Validators.required]] ,
      provinceCode : [null , [Validators.required]] ,
      telphone: [null, [Validators.required]],
      isFirst: [true, [Validators.required]]
    });
    this.getIncomeFlag();
  }

  incomeProof: string = "../../assets/imgs/income/bg.png";
  enum_provinceCode : Array< {name : string , value : string } > ;

  @Before(function() {
    return new Observable(obsr => {
      if (!this.validForm.valid) {
        this.msg.require();
        return;
      }
      obsr.next("success");
    });
  })
  @Before(function() {
    return new Observable(obsr => {
      let data = this.riskTime;
      data["nextStep"] = now() + ",";
      this.userAction.userIncome(data);
      obsr.next("success");
    });
  })
  @CombineAll()
  nextBtn($event) {
    let data = this.validForm.value;

    if (data.isFirst && !this.postData.get("incomeProof") && this.incomeFlag) {
      this.msg.require();
      return;
    }

    if (!this.postData.get("socialIdentityCode"))
      this.postData.append("socialIdentityCode", data.socialIdentityCode);

    if (
      !this.postData.get("companyName") &&
      data.companyName != "null"
    )
      this.postData.append("companyName", data.companyName);

    if (!this.postData.get("provinceCode"))
      this.postData.append("provinceCode", data.provinceCode);

    if (!this.postData.get("city"))
      this.postData.append("city", data.city);

    if (!this.postData.get("regent"))
      this.postData.append("regent", data.regent);

    if (!this.postData.get("block"))
      this.postData.append("block", data.block);

    if (!this.postData.get("street"))
      this.postData.append("street", data.street);

    if (!this.postData.get("telphone"))
      this.postData.append("telphone", data.telphone);

    if (!this.postData.get("monthlyIncome"))
      this.postData.append("monthlyIncome", data.monthlyIncome);

    if (!this.postData.get("isFirst"))
      this.postData.append("isFirst", data.isFirst);

    const postData = this.postData;

    const el = <HTMLButtonElement>$event.target;

    el.disabled = true;

    let model = this.load.deal();
    model.present();
    this.reviewSer
      .saveWork(this.postData)
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }

          model.dismiss();

          el.disabled = false;

          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.setListStatus(1)
        this.slideTo("ContactPage");
      });
  }

  takeCam(name: string) {
    this.makeRecord(name);
    this.img.takeCam().subscribe(data => {
      console.log("照片回调----imgchange---", data);
      if (data["code"] === 1) {
        const base64 = "data:image/jpeg;base64," + data["imageBase64"];
        this.zone.run(() => {
          this[name] = base64;
        });
        const pictureTrueSize = data["pictureTrueSize"];
        const pictureUri = data["pictureUri"];
        const resolutionCap = data["resolutionCap"];

        if (this.postData.has(name)) this.postData.delete(name);

        const file = this.img.base64ToImg(<string>base64);

        this.postData.append(name, file);
        // this.postData.append("incomeProof" , file)
        this.postData.append(name + "Size", pictureTrueSize);
        this.postData.append(name + "Path", pictureUri);
        this.postData.append(name + "ResolutionCap", resolutionCap);
        //成功
      } else if (data["code"] === 2) {
        //取消
      } else if (data["code"] === 0) {
        //拒绝
      }
    });
  }

  resMark: boolean = false;

  imgLoads: Object = {
    incomeProof: {
      hasOwn: false,
      loadComplete: false
    }
  };

  getIncomeFlag(){
    this.reviewSer.getParam()
        .pipe(
            filter(
                (res : Response) => {
                    if(res.success === false){
                        this.msg.operateFail(res.message) ;
                    };

                    this.resMark = true ;

                    return res.success === true && res.data != null ;
                }
            )
        )
        .subscribe(
            (res : Response) => {

              this.incomeFlag = res.data[0].activate;
              // this.faceFlag = 1;
              console.log('收入必填开关:'+this.incomeFlag)

              this.validForm.patchValue(< Object >res.data) ;
          }
      )
  };


  getWork() {
    this.reviewSer
      .getWork()
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }

          this.resMark = true;

          return res.success === true && res.data != null;
        })
      )
      .subscribe((res: Response) => {
        if (res.data["incomeProof"] != null) res.data["isFirst"] = false;

        if (res.data["incomeProof"] != null) {
          this.incomeProof = res.data["incomeProof"];
          this.imgLoads["incomeProof"]["hasOwn"] = true;
        }
        this.validForm.patchValue(<Object>res.data);
      });
  }

  showModel(value: string, itemName: string, riskName: string) {
    this.makeRecord(riskName);
    let data = this[value];

    let model = this.modelCtr.create(ListModelComponent, { list: data });

    model.onDidDismiss(data => {
      if (data) {
        let obj = {} ;
        obj[itemName] = data.value ;
        this.validForm.patchValue(obj) ;
        let el =  <HTMLInputElement>document.querySelector(`#${itemName}`) ;
        el.value = data.name ;
      }
    });

    model.present();
  }

  slideTo(name: string | boolean, step?) {
    if (name !== false) this.nav.push(<string>name);

    if (step !== undefined) {
      let obj = this.riskTime;
      obj["stepId"] = step;
      obj["step"] = now() + ",";
      this.userAction.userIncome(obj);
    }
  }
  back(par) {
    let data = par.riskTime;
    data["topBack"] = now() + ",";
    par.userAction.userIncome(data);
    par.nav.pop();
    // par.nav.push('certificationPage');
  }

  imgLoadComplete() {
    this.imgLoads["incomeProof"]["loadComplete"] = true;
  }

  riskTime = {
    socialIdentity: "",
    topBack: "",
    incomeProof: "",
    incomeSource: "",
    monthlyIncome: "",
    nextStep: "",
    companyName: "",
    step: "",
    stepId: ""
  };

  makeRecord(name: string) {
    this.riskTime[name] += now() + ",";
  }
  setListStatus(num){
      let listStatus = this.sgo.get('listStatus');
      listStatus.work.status = num;
      this.sgo.set('listStatus',listStatus)
  }
}
