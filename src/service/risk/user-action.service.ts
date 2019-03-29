import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API } from "../global_api";
import { Injectable } from "@angular/core";
import { TipService } from "../../service";

@Injectable()
export class UserActionService {
  constructor(private http: HttpClient, private tip: TipService) {}

  private HOST: string = API.host;

  private jsonHeader = new HttpHeaders().set(
    "Content-type",
    "application/json"
  );

  loginTime(data: Object) {
    const url = this.HOST + "/user/behavior/loginClickTime";
    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }

  registTime(data: Object) {
    const url = this.HOST + "/user/behavior/registerClickTime";

    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }

  setPass(data: Object) {
    const url = this.HOST + "/user/behavior/modifyPasswordClickTime";

    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }

  home(data: Object) {
    const url = this.HOST + "/user/behavior/countLoanClickTime";

    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }

  loanPurpose(data: Object) {
    const url = this.HOST + "/user/behavior/borrowPurposeClickTime";

    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }

  cpf(data: Object) {
    const url = this.HOST + "/user/behavior/cpfClickTime";

    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }
  auth(data: Object) {
    const url = this.HOST + "/user/behavior/userAuthClickTime";

    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }

  userInfo(data: Object) {
    const url = this.HOST + "/user/behavior/userInfoClickTime";

    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }

  userIncome(data: Object) {
    const url = this.HOST + "/user/behavior/userWorkClickTime";

    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }

  contact(data: Object) {
    const url = this.HOST + "/user/behavior/userContactClickTime";

    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }

  audit(data: Object) {
    const url = this.HOST + "/user/behavior/skipWaitAuditClickTime";

    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }

  changePass(data: Object) {
    const url = this.HOST + "/user/behavior/modifyPasswordClickTime";

    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }

  forgetPass(data: Object) {
    const url = this.HOST + "/user/behavior/forgetPasswordClickTime";

    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }

  takeCash(data: Object) {
    const url = this.HOST + "/user/behavior/cashClickTime";
    this.http
      .post(url, data, {
        headers: this.jsonHeader
      })
      .subscribe(res => {});
  }
}
