import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from "@angular/common/http";
import { TipService } from "../service/common";
import { catchError } from "rxjs/operators";
import { App, NavController } from "ionic-angular";
import { Observable } from "rxjs";
import bridge from "../tools/bridge";
@Injectable()
export class LoginInterceptor implements HttpInterceptor {
  constructor(
    private app: App,
    private msg: TipService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    const reg = /.*\/assets\/\d+/g;

    let headerObj = {};

    let headers;

    let local = window.sessionStorage.getItem("locale");

    let obj = {
      withCredentials: true
    };

    if (reg.test(req.url)) {
      req = req.clone(obj);

      return next.handle(req);
    } else {
      const coords = JSON.parse(window.sessionStorage.getItem("coords"));

      headerObj["g4-osType"] = "3";

      headerObj["g4-latitude"] = coords ? coords["lat"] : "0";

      headerObj["g4-longitude"] = coords ? coords["lng"] : "0";
      headerObj["g4-deviceId"] = window.navigator.userAgent;
      headerObj["g4-appsflyId"] = "0";

      if (window.sessionStorage.getItem("deviceId")) {
        headerObj["g4-deviceId"] = window.sessionStorage.getItem("deviceId");
      }

      if (window.sessionStorage.getItem("appsId")) {
        headerObj["g4-appsflyId"] = window.sessionStorage.getItem("appsId");
      }

      headerObj["g4-uid"] = "0";

      if (
        window.sessionStorage["loginInfo"] &&
        window.sessionStorage["loginInfo"] !== "{}"
      ) {
        let usrInfo = JSON.parse(window.sessionStorage["loginInfo"]);
        headerObj["g4-uid"] = usrInfo["id"] + "";
        headerObj["g4-token"] = usrInfo["token"];
        headerObj["g4-deviceId"] = usrInfo["deviceId"];
        headerObj["g4-latitude"] = usrInfo["latitude"];
        headerObj["g4-longitude"] = usrInfo["longitude"];
        headerObj["g4-vest"] = usrInfo["vest"] || 1;
        headerObj["g4-systemVersion"] = getAndroidVer() || "2.0.0";
        headerObj["g4-appsflyId"] = usrInfo["appsflyId"];
        headerObj["g4-clientId"] = usrInfo["clientId"];
        headerObj["g4-deviceType"] = usrInfo["deviceType"];
        headerObj["Accept-Language"] = local;
        headerObj["g4-appVersion"] = usrInfo["appVersion"];
      } else {
        headerObj["g4-uid"] = "0";
        headerObj["g4-token"] = "";
        headerObj["g4-deviceId"] = "b75431ed035c491089f84b5517c26f47";
        headerObj["g4-latitude"] = "0";
        headerObj["g4-longitude"] = "0";
        headerObj["g4-vest"] = "1";
        headerObj["g4-systemVersion"] = "2.0.0";
        headerObj["g4-appsflyId"] = "1545270775890-1978421542311634016";
        headerObj["g4-clientId"] = "39a13aa80b9958123bedf19da872387d";
        headerObj["g4-deviceType"] = "XiaoMi6";
        headerObj["g4-appVersion"] = "2.0.0";
      }
      headers = new HttpHeaders(headerObj);
      obj["headers"] = headers;
      req = req.clone(obj);

      return next.handle(req).pipe(
        catchError(err => {
          let code = err["status"];

          if (code == 401) {
            // this.getNavCtrl() ;
            this.msg.outOfDate();
            bridge["goLogin"]();
            // this.nav.push("LoginPage") ;
          }

          return Observable.throw(err);
        })
      );
    }
  }

  nav: NavController;

  private getNavCtrl() {
    this.nav = this.app.getActiveNav();
  }
}

let getAndroidVer = function() {
  var ua = navigator.userAgent.toLowerCase();
  var version = "";
  if (ua.indexOf("android") > 0) {
    var reg = /android [\d._]+/gi;
    return ua.match(reg)[0] ? ua.match(reg)[0] : "";
  }
  return version;
};
