import { Injectable } from '@angular/core';
import { API } from "../../service/global_api";
import { ObjToQuery } from '../ObjToQuery' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient } from '@angular/common/http';


@Injectable()
export class detaildService {
    constructor(
        private http: HttpClient,

    ) { };


    get(id : number) {
        let url = API.investList.detail + `/${id}`;
        return this.http.get(url);
    };
};