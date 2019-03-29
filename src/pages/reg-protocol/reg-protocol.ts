import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import bridge from '../../tools/bridge';

/**
 * Generated class for the RegProtocolPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "RegProtocol"
})
@Component({
  selector: "page-reg-protocol",
  templateUrl: "reg-protocol.html"
})
export class RegProtocolPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  back() {
    bridge['goBack']();
  }
}
