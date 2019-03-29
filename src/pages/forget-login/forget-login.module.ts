import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ForgetLoginPage } from "./forget-login";
import { ShareModule } from "../../share/share.module";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [ForgetLoginPage],
  imports: [IonicPageModule.forChild(ForgetLoginPage), ShareModule, ComponentsModule]
})
export class ForgetLoginPageModule {}
