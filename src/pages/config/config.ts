import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { SetPaypassComponent } from "../../components/set-paypass/set-paypass";
import { SetUserpassComponent } from "../../components/set-userpass/set-userpass";
import { AboutUsPage } from "../about-us/about-us";
import { SesssionStorageService } from "../../service";
@IonicPage({
  name: "ConfigPage"
})
@Component({
  selector: "page-config",
  templateUrl: "config.html"
})
export class ConfigPage implements OnInit {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sgo: SesssionStorageService
  ) {}

  userInfo: Object;

  APP_VERSION: string = this.sgo.get("loginInfo")["appVersion"] || "";
  ngOnInit() {}

  forUsrPass() {
    this.navCtrl.push(SetUserpassComponent);
  }

  setPayPass() {
    this.navCtrl.push(SetPaypassComponent);
  }

  aboutUs() {
    this.navCtrl.push("AboutUsPage");
  }
}
