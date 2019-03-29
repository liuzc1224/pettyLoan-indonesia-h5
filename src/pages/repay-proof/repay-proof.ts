import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImgService, LoadingService, OrderService, TipService, UserActionService, SesssionStorageService } from '../../service';
import { filter } from 'rxjs/operators';
import { Response } from '../../share/model';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular'
import { ListModelComponent } from "../../components/list-model/list-model";
import { now } from "../../tools";
import { Before, CombineAll } from "../../decorators/function.decorator";
import { Observable } from "rxjs";
import bridge from "../../tools/bridge";
@IonicPage({
  name: "RepayProofPage"
})
@Component({
  selector: "repay-proof",
  templateUrl: "repay-proof.html"
})
export class RepayProofComponent implements OnInit {
  parent = this;
  constructor(
      private fb : FormBuilder ,
      private img : ImgService ,
      private orderSer: OrderService,
      private modelCtr: ModalController,
      private msg : TipService ,
      public navParams: NavParams,
      private nav : NavController ,
      private sgo: SesssionStorageService,
      private loadSer : LoadingService ,
      private userAction : UserActionService,
      private zone: NgZone
  ){};

  postData : FormData = new FormData() ;
  enum_type: Array<{ name: string; value: string }>;
  validForm : FormGroup ;
  orderId : any;
  repayProof: string = "../../assets/imgs/income/bg.png";
  ngOnInit(){
    this.orderId = this.navParams.get("orderId");
      this.postData = new FormData() ;
      this.initForm() ;
  };

  initForm(){
      this.validForm = this.fb.group({
          "orderId" : [this.orderId , [Validators.required ] ] ,
          "repayType" : [null , [ Validators.required ] ],
          "repayMoney" : [null , [ Validators.required ] ]
      });
      this.enum_type = [
        { name: "Pembayaran sebagian", value: "1" },
        { name: "Pelunasan penuh", value: "2" }
      ]
  };

  @Before(function(){
      return new Observable( obsr => {
          if(!this.validForm.valid){
              this.msg.require();
              return ;
          };
          obsr.next("success") ;
      });
  })
  @CombineAll()
  nextBtn($event){
    let data = this.validForm.value;
    if (data.isFirst && !this.postData.get("repayProof")) {
      this.msg.require();
      return;
    }

    if(!this.postData.get("orderId"))
        this.postData.append("orderId" , data.orderId);

    if(!this.postData.get("repayType"))
        this.postData.append("repayType" , data.repayType);

    if(!this.postData.get("repayMoney"))
        this.postData.append("repayMoney" , data.repayMoney);

    let el = <HTMLButtonElement>$event.target ;

    el.disabled = true ;

    let model = this.loadSer.deal();

    model.present() ;

    this.orderSer.addRepayProof(this.postData)
      .pipe(
        filter(
          (res : Response) => {

            if(res.success === false){
                this.msg.operateFail(res.message) ;
            };

            el.disabled = false ;

            return res.success === true ;
          }
        )
      )
      .subscribe(
        ( res : Response ) => {
          this.msg.operateSuccess('success') ;
          bridge["goHome"]();
        }
      );
  };

  imgLoads: Object = {
    repayProof: {
      hasOwn: false,
      loadComplete: false
    }
  };

  takeCam(name: string) {
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
        // this.postData.append("repayProof" , file)
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



  showModel(value: string, itemName: string, riskName: string) {
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

  imgLoadComplete() {
    this.imgLoads["repayProof"]["loadComplete"] = true;
  }


  back(par){
    par.nav.pop() ;
  };
}
