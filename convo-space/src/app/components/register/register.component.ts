import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authservice';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(public router: Router, public authService: AuthService) { }

  ngOnInit() { }

  register(email, name, password, passwordConfirm){
    if(password != passwordConfirm){
      console.log("password mismatch");
    }
    else{
      this.authService.register(email, password)
      .then(user => {
        const path = `users/${user.uid}`;
        
        const data = {
          email: email,
          displayName: name,
          status: 'offline'
        };

        this.authService.update(path, data)
        .then(data => {
          this.authService.logout()
          .then(_ => {
            this.router.navigate(['login']);
          });
        })
      });
    }
  }
}
