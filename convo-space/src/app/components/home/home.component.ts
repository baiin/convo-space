import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authservice';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users: any[];
  messages: any[];
  user: User;

  authSub: ISubscription;
  usersSub: ISubscription;
  messagesSub: ISubscription;

  constructor(public router: Router, public authService: AuthService) { }

  ngOnDestroy()
  {
    this.authSub.unsubscribe();
    this.usersSub.unsubscribe();
    this.messagesSub.unsubscribe();
  }

  ngOnInit() {
    this.user = {
      displayName: "",
      email: "",
      status: "",
      uid: ""
    }

    this.authSub = this.authService.checkAuth()
    .subscribe(user => {
      if(!user){
        this.router.navigate(['login']);
      }
      else{
        console.log('logged in');
      }
    })

    this.usersSub = this.authService.loadUsers()
    .subscribe(snapshots => {
      this.users = [];
      snapshots.forEach(snapshot => {
        if(snapshot.key == this.authService.retrieveUID()){
          this.user = {
            uid: snapshot.key,
            displayName: snapshot.val().displayName,
            email: snapshot.val().email,
            status: snapshot.val().status
          };
        }

        this.users.push({
          'displayName': snapshot.val().displayName
        });
      });
    });

    this.messagesSub = this.authService.loadMessages()
    .subscribe(snapshots => {
      this.messages = []
      snapshots.forEach(snapshot => {
        let date = "";

        if(snapshot.val().date){
          date = snapshot.val().date.split("GMT")[0];
        }

        this.messages.push({
          'uid': snapshot.val().uid,
          'body': snapshot.val().body,
          'displayName': snapshot.val().displayName,
          'self': snapshot.val().uid == this.authService.retrieveUID() ? true : false,
          'date': date
        });
      });

      this.updateScroll();
    });
  }

  logout(){
    const uid = this.authService.retrieveUID();
    const path = `users/${uid}`;
    const obj = {'status': 'offline'};

    this.authService.update(path, obj)
    .then(value => {
      this.authService.logout()
      .then(_ => {
        this.router.navigate(['login']);
      });
    });
  }

  inputEvent(event, body){
    if(event.keyCode == 13){
      this.sendMessage(body);
    }
  }

  sendMessage(body){
    let date = new Date();

    let newMessage = {
      body: body,
      uid: this.user.uid,
      displayName: this.user.displayName,
      date: date.toString()
    };

    this.updateScroll();

    this.authService.pushData('messages', newMessage);
  }

  updateScroll(){
    window.setTimeout(function() {
      var elem = document.getElementById('content');
      elem.scrollTop = elem.scrollHeight;
    }, 100);
  }
}

interface Message
{
  body:string;
  uid:string;
  displayName:string;
  self:boolean;
  date:string
}

interface User
{
  uid:string;
  displayName:string;
  email:string;
  status:string;
}


