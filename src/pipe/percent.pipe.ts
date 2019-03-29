import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "PercentPipe"
})
export class PercentPipe implements PipeTransform {
  transform(value: any): any {
    return (value * 100).toFixed(2).replace(".", ",");
  }
}
