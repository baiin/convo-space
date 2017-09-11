import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase, public router: Router) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(auth => {
      if(auth){
        this.router.navigate(['']);
      }
      else{
        console.log('not logged in');
      }
    });
  }

  login(email, password){
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(data => {

      const path = `users/${data.uid}`;

      this.db.object(path).update({'status': 'online'})
      .then(value => {
        console.log("logged in");
        this.router.navigate(['']);
      });
    })
    .catch(error => {
      console.log("error: " + error);
    });
  }
}
