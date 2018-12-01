import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: boolean = false;
  invalidLogin: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, public snackBar: MatSnackBar) { }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
        this.showMsg("All fields required");
        return;
    }
    if(this.loginForm.controls.email.value == 'teste@teste.com' && this.loginForm.controls.password.value == '321') {
        window.location.href = '/artist';
    }else {
      this.invalidLogin = true;
      this.showMsg("Incorrect email or password");
    }
  }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    showMsg(msg :string) {
        this.snackBar.open(msg, 'Close', {
          duration: 3000
        });
    }

}
