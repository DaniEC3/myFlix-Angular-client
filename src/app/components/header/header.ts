import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf,NgSwitch,NgSwitchCase,NgSwitchDefault,RouterModule,MatButtonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  menuOpen = false;

  token: string | null = null;

  constructor(private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.token$.subscribe(token => {
      this.token = token;
    })
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authService.setToken(null);
  }

}
