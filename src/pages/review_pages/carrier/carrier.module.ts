import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CarrierComponent } from "./carrier";
import { ShareModule } from "../../../share/share.module";
@NgModule({
  declarations: [CarrierComponent],
  imports: [IonicPageModule.forChild(CarrierComponent), ShareModule]
})
export class CarrierComponentPageModule {}
