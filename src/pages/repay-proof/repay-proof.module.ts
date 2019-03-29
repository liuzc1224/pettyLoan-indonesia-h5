import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { RepayProofComponent } from "./repay-proof";
import { ShareModule } from "../../share/share.module";
@NgModule({
  declarations: [RepayProofComponent],
  imports: [IonicPageModule.forChild(RepayProofComponent), ShareModule]
})
export class RepayProofPageModule {}
