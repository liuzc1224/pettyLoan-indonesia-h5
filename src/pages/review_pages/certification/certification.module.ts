import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CertificationComponent } from "./certification";
import { ShareModule } from "../../../share/share.module";
@NgModule({
  declarations: [CertificationComponent],
  imports: [IonicPageModule.forChild(CertificationComponent), ShareModule]
})
export class CertificationPageModule {}
