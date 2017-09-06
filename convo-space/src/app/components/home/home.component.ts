import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: string;

  constructor(public router: Router, public afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.user = ""; 

    this.afAuth.authState.subscribe(auth => {
      if(auth){
        console.log(auth);
        this.user = auth.displayName;
      }
      else{
        this.router.navigate(['login']);
      }
    });
  }

  logout(){
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



