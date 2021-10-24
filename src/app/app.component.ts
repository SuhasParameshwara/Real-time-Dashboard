import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageRequest, SignalRService } from './signalr.service';
import * as signalR from '@microsoft/signalr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private hubConnection: signalR.HubConnection | undefined;
  public chartData: number[] = [123, 120, 125];
  public randomNumber: number = 0;
  constructor(private _signalRService: SignalRService, private _changeDetectorRef: ChangeDetectorRef) {
  }
  ngOnInit() {
    this._signalRService.getConnectionInfo().subscribe(async (response: any) => {
      let options = {
        accessTokenFactory: () => response.accessToken,
      };
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(response.url, options)
        .build();
      this.hubConnection.start().then(async () => {
        console.log("successfully connected");
        while (this.hubConnection?.state == signalR.HubConnectionState.Connected) {
          console.log("Connected...");
          const request = new MessageRequest();
          request.currentUnitRate = Math.floor(Math.random() * 140);
          this._signalRService.sendMessage(request).subscribe((response) => {
          });
          await this.delay(3000);
        }
      }).catch(err => console.error(err.toString()));

      this.hubConnection.on("notify", async (data: string) => {
        const response = JSON.parse(data) as MessageRequest;
        console.log(response.currentUnitRate);
        this.chartData.push(response.currentUnitRate);
        //this._changeDetectorRef.detectChanges();
        this.chartData = Object.assign([{}], this.chartData);
      });
    });
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
