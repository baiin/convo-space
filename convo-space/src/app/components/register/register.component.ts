import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  disableReg: boolean;
  userObservable: FirebaseListObservable<any[]>;

  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase, public router: Router) { }

  ngOnInit() {
    this.disableReg = false;
    
    this.userObservable = this.db.list('/users');
  }

  register(email, name, password, passwordConfirm){
    console.log('register');
    if(password != passwordConfirm){
      console.log("password mismatch");
    }
    else{
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const path = `users/${user.uid}`;

        const data = {
          email: email,
          displayName: name,
          status: 'offline'
        };

        this.db.object(path).update(data)
        .then(data => {
          console.log('registration successful');
          this.router.navigate(['login']);
        })
        .catch(error => {
          console.log(error);
        });
      })
      .catch(error => console.log(error));
    }
  }
}
