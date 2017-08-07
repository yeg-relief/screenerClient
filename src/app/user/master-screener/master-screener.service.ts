import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import { Question } from '../../shared';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FormGroup } from "@angular/forms";

@Injectable()
export class MasterScreenerService {
    results = [];
    constructor(private http: Http) { }

    loadQuestions(): Observable<Question[]> {
        return this.http.get('/api/screener/')
            .map(res => res.json())
            .catch(e => MasterScreenerService.handleError(e));
    }

    loadResults(form: FormGroup) {
        const updatedForm = MasterScreenerService.checkForInvalid(form);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        const body = JSON.stringify({ data: updatedForm.value});
        return this.http.post('/api/notification/', body, options)
            .map(res => res.json().response)
            .catch(MasterScreenerService.loadError)
            .toPromise();
    }

    static checkForInvalid(form: FormGroup): FormGroup {
        if (!form.valid) {
            for (const key in form.errors) {
                form.removeControl(key);
            }
        }
        return form;
    }

    static handleError(error: Response | any): Observable<any> {
        let errMsg: string;
        if (error instanceof Response) {
            let body;
            try {
                body = error.json();
            } catch (e) {
                body = ''
            }
            errMsg = body.message || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw({ error : errMsg });
    }


    static loadError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg = body.message || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
