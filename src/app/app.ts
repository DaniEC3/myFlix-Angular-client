import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HeaderComponent } from "./components/header/header";
import { Router, NavigationStart } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    HeaderComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected title = 'myFlix-Angular-client';
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && event.url === '/') {
        const token = localStorage.getItem('token');
        if (token) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
