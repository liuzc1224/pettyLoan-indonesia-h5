import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ConfirmCardComponent } from "./confirm-card";
import { ShareModule } from "../../../share/share.module";
@NgModule({
  declarations: [ConfirmCardComponent],
  imports: [IonicPageModule.forChild(ConfirmCardComponent), ShareModule]
})
export class ConfirmCardPageModule {}
