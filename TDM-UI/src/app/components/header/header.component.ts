import { CommonModule } from '@angular/common';
import { Component, DoCheck } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../service/sharedata.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements DoCheck {
  constructor(private router: Router, private sharedData: DataService) {}

  ifLoggedIn: any;
  role: any;
  menuActive: boolean = false;
  dropdownVisible: boolean = false;
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  closeMenu() {
    this.menuActive = false;
  }
  ngDoCheck() {
    if (typeof window !== 'undefined') {
      this.ifLoggedIn = localStorage.getItem('username')?.toUpperCase();
      this.role = localStorage.getItem('role');
    }
  }
  clearStorage() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['login']);
  }
  resetServiceData() {
    this.sharedData.setTransID(null);
  }
}
