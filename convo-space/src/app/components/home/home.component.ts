import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users: any[];
  messages: any[];
  user: User;

  constructor(public router: Router, public afAuth: AngularFireAuth, public db: AngularFireDatabase) { }

  ngOnInit() {
    this.user = {
      displayName: "",
      email: "",
      status: "",
      uid: ""
    }

    if(!this.afAuth.auth.currentUser){
      this.router.navigate(['login']);
    }

    const usersOb = this.db.list('users', {
      query: {
        orderByChild: 'status',
        equalTo: 'online'
      },
      preserveSnapshot: true
    });

    usersOb.subscribe(snapshots => {

      this.users = [];
      snapshots.forEach(snapshot => {
        if(snapshot.key == this.afAuth.auth.currentUser.uid){
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

    const messagesOb = this.db.list('messages', {
      preserveSnapshot: true
    });

    messagesOb.subscribe(snapshots => {

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
          'self': snapshot.val().uid == this.afAuth.auth.currentUser.uid ? true : false,
          'date': date
        });
      });

      this.updateScroll();
    });
  }

  logout(){
    this.db.object(`users/${this.afAuth.auth.currentUser.uid}`)
    .update({'status': 'offline'})
    .then(value => {
      this.afAuth.auth.signOut()
      .then(_ => {
        console.log('logged out');
        this.router.navigate(['login']);
      })
      .catch(error => {
        console.log("error: " + error);
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

    this.db.list('messages').push(newMessage);
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


