import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.css',
})
export class NotfoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['login']); 
  }
}
