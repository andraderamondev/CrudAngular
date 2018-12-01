import { ChangeDetectorRef, Component} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  	title = 'app';
  	mobileQuery: MediaQueryList;
  	shouldRun = true;
    showBar: boolean;
  	action: string;
  	
  	constructor(private router: Router,changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) { 
    	  this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this.action = window.location.pathname;
    }

    ngOnInit() {
      if(this.action=="/"){
        this.showBar = false;
      }else{
        this.showBar = true;
      }
      console.log(this.action);
  	}

    exit(){
      window.location.href = '/';
    }
}