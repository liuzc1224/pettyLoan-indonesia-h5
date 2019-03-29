import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { contractDetailPage } from "./contract-detail";
import { ShareModule } from "../../share/share.module";
import { ComponentsModule } from "../../components/components.module";
@NgModule({
  declarations: [contractDetailPage],
  imports: [
    IonicPageModule.forChild(contractDetailPage),
    ShareModule,
    ComponentsModule
  ]
})
export class contractDetailPageModule {}
