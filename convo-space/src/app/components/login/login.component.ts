import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authservice';
import { ISubscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authSub: ISubscription;

  constructor(public router: Router, private authService: AuthService) { }

  ngOnDestroy()
  {
    this.authSub.unsubscribe();
  }

  ngOnInit() {
    this.authSub = this.authService.checkAuth()
    .subscribe(auth => {
      if(auth){
        this.router.navigate(['']);
      }
      else{
        console.log('not logged in');
      }
    });
  }

  login(email, password){
    this.authService.login(email, password)
    .then(data => {

      const path = `users/${data.uid}`;
      const obj = {'status': 'online'};

      this.authService.update(path, obj)
      .then(value => {
        this.router.navigate(['']);
      });
    });
  }
}
