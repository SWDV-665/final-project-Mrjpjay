import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {map, catchError} from 'rxjs/operators'
import { Subject } from 'rxjs';


/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {

  items : any = []

  baseUrl = "http://localhost:8080"
  
  dataChanged$: Observable<Boolean>;

  private dataChanchedSubject: Subject<Boolean>;

  constructor(public httpClient: HttpClient) {
    console.log('Hello DataServiceProvider Provider');

    this.dataChanchedSubject = new Subject<Boolean>();
    this.dataChanged$ = this.dataChanchedSubject.asObservable();
  }

  editItem(item, index){
    this.httpClient.put(this.baseUrl + "/api/groceries/" + item._id, item).subscribe(res => {
      this.items = res;
      this.dataChanchedSubject.next(true);
      console.log(res.toString);
    },
    error =>{
      console.error("editItem error ", error);
    });
  }
  
  addItem(data){
    this.httpClient.post(this.baseUrl + "/api/groceries", data).subscribe(res =>{
      this.items = res;
      this.dataChanchedSubject.next(true);
    },
    error =>{
      console.error("addItem error ", error);
    }
    );
  }

  removeItem(id){
    this.httpClient.delete(this.baseUrl + "/api/groceries/" + id).subscribe(res =>{
      this.items = res;
      this.dataChanchedSubject.next(true);
    },
    error =>{
      console.error("removeItem error ", error);
    });
  }

  getItems(): Observable<object[]> {
    return this.httpClient.get(this.baseUrl + '/api/groceries').pipe(
      map(this.exctractData),
      catchError(this.handleError)
    );
  }

  private exctractData(res: Response){
    let body = res;
    return body || {};
  }

  private handleError(error: Response | any){
    let errMsg: String;
    if(error instanceof Response){
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return Observable.throw(errMsg);
  }

}
