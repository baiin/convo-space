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

  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase, public router: Router) { }

  ngOnInit() {
    this.disableReg = false;
  }

  register(email, name, password, passwordConfirm){
    console.log('register');
    if(password != passwordConfirm){
      console.log("password mismatch");
    }
    else{
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        var u = firebase.auth().currentUser;
        u.updateProfile({
          displayName: name,
          photoURL: ""
        })
        .then(data => this.router.navigate(['login']));
      })
      .catch(error => console.log(error));
    }
  }
}
