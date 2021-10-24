import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { environment } from "../environments/environment";
import * as signalR from '@microsoft/signalr';

@Injectable({
    providedIn: "root",
})

export class SignalRService {
    private readonly _http: HttpClient;
    private readonly _baseUrl: string = environment.azureConnection;

    messages: Subject<string> = new Subject();

    constructor(http: HttpClient) {
        this._http = http;
    }

    public getConnectionInfo() {
        return this._http.get("https://testdemosuhas.azurewebsites.net/api/negotiate");
    }

    public sendMessage(request: MessageRequest) {
        return this._http.post("https://testdemosuhas.azurewebsites.net/api/message", request);
    }
}

export class MessageRequest {
    currentUnitRate: number;
    constructor() {
        this.currentUnitRate = 0;
    }
}