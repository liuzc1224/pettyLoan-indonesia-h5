import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImgService, LoadingService, ReviewService, TipService, UserActionService, SesssionStorageService } from '../../../service';
import { filter } from 'rxjs/operators';
import { Response } from '../../../share/model';
import { IonicPage, NavController } from 'ionic-angular'
import { now } from "../../../tools";
import { Before, CombineAll } from "../../../decorators/function.decorator";
import { Observable } from "rxjs";
@IonicPage({
  name: "confirmCardPage"
})
@Component({
  selector: "confirm-card",
  templateUrl: "confirm-card.html"
})
export class ConfirmCardComponent implements OnInit {
  parent = this;
  constructor(
      private fb : FormBuilder ,
      private img : ImgService ,
      private reviewSer : ReviewService ,
      private msg : TipService ,
      private nav : NavController ,
      private sgo: SesssionStorageService,
      private loadSer : LoadingService ,
      private userAction : UserActionService,
      private zone: NgZone
  ){};

  front : string = '../assets/imgs/auth/front.png' ;

  reverse : string = '../assets/imgs/auth/back.png' ;

  // hand : string = '../assets/imgs/auth/hand.png' ;

  postFaceData : FormData = new FormData() ;

  validForm : FormGroup ;

  imgLoads : Object = {
      front : {
          hasOwn : false ,
          loadComplete : false
      },
      reverse : {
          hasOwn : false ,
          loadComplete :  false
      }
      ,
      // hand : {
      //     hasOwn : false ,
      //     loadComplete :  false
      // }
  };
  ngOnInit(){
      this.postFaceData = new FormData() ;
      this.initForm() ;
      this.getAuthInfo() ;
  };

  initForm(){
      this.validForm = this.fb.group({
          "idNumber" : [null , [Validators.required ] ] ,
          "username" : [null , [ Validators.required ] ] ,
          "motherFirstName" : [null],
          "fatherFirstName" : [null] ,
          "isFirst" : [true , [Validators.required]]
      });
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
  @Before(function(){
      return new Observable( obsr => {
          let obj = this.riskTime ;
          obj['nextStep'] = now() + "," ;
          this.userAction.auth(obj) ;
          obsr.next("success") ;
      })
  })
  @CombineAll()
  nextBtn($event){
      const data = this.validForm.value ;

      let postData = {
        "idNumber": data.idNumber,
        "usernameShort": data.username
      };

      let el = <HTMLButtonElement>$event.target ;

      el.disabled = true ;

      let model = this.loadSer.deal();

      model.present() ;

      this.reviewSer.saveUserInfo(postData)
          .pipe(
              filter(
                  (res : Response) => {

                      if(res.success === false){
                          this.msg.operateFail(res.message) ;
                      };
                      if (this.faceFlag != 1) {
                          model.dismiss() ;
                      }

                      el.disabled = false ;

                      return res.success === true ;
                  }
              )
          )
          .subscribe(
              ( res : Response ) => {
                  if (this.faceFlag) {
                      console.log('开始人脸识别')
                      this.getFace(model)
                  }else{
                      this.nav.push("UserInfoPage") ;
                      this.setListStatus(1)
                  }
              }
          );
  };



  getFace(model){
      this.img.getFace()
          .subscribe(
              (data) => {
                  console.log('人脸识别： ', data);

                  if (data === 'success') {
                      this.nav.push("UserInfoPage") ;
                      this.setListStatus(1)
                      //成功
                  }else{
                      console.log('人脸识别： 失败');
                  }
                  model.dismiss();
              }
          )
  }

  postFace(model){
      this.reviewSer.saveFace(this.postFaceData)
          .subscribe(
              ( res :Response ) => {
                  this.nav.push("UserInfoPage") ;
                  model.dismiss();
              }
          )
  }

  resMark : boolean = false ;
  faceFlag: Number = 0;

  getAuthInfo(){
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
                // if(res.data['front'] != null){
                //     this.front = res.data['front'];
                //     this.imgLoads['front']['hasOwn'] = true ;
                // }

                // if(res.data['reverse'] != null){
                //     this.imgLoads['reverse']['hasOwn'] = true ;
                //     this.reverse = res.data['reverse'];
                // };

                // if(res.data['hand'] != null){
                //     this.hand = res.data['hand'];
                //     this.imgLoads['hand']['hasOwn'] = true ;
                // };

                if(res.data['modifyTime'] != null){
                    res.data['isFirst'] = false ;
                };

                this.faceFlag = res.data[1].activate;
                // this.faceFlag = 1;
                console.log('人脸识别开关:'+this.faceFlag)

                this.validForm.patchValue(< Object >res.data) ;
            }
        )
  };


  back(par){
    let obj = par.riskTime ;
    obj['topBack'] = now() + "," ;
    par.userAction.auth(obj) ;
    par.nav.pop() ;
  };
  toOCR(){
    this.nav.pop() ;
  }

  imgLoadComplete($evnet : "front" | "reverse" | "hand" ){
      this.imgLoads[$evnet]['loadComplete'] = true ;
  };

  riskTime = {
      "idNumber": "",
      "nextStep": "",
      "step": "",
      "stepId": "" ,
      "username": "",
      "topBack": "",
      "front" : "",
      "reverse" : "",
      // "hand" : ""
  };

  makeRecord(name : string){
      this.riskTime[name] += now() + "," ;
  };

  setListStatus(num){
      let listStatus = this.sgo.get('listStatus');
      listStatus.identify.status = num;
      this.sgo.set('listStatus',listStatus)
  }
}
