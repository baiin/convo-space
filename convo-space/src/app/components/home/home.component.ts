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

  user: FirebaseObjectObservable<any[]>;

  constructor(public router: Router, public afAuth: AngularFireAuth, public db: AngularFireDatabase) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(auth => {
      if(auth){
        const path = `users/${auth.uid}`;

        this.user = this.db.object(path);
      }
      else{
        this.router.navigate(['login']);
      }
    });
  }

  logout(){
    console.log('logout');
    this.afAuth.auth.signOut()
    .then(data => {
      console.log('logged out');
      this.router.navigate(['login']);
    })
    .catch(error => {
      console.log("error: " + error);
    });
  }
}



