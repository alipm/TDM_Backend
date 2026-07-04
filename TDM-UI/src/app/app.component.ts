import { CommonModule } from '@angular/common';
import { Component, DoCheck } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements DoCheck {
  title = 'WM-TDM';
  visible = true;

  constructor(private route: Router) {}

  ngDoCheck() {
    let currentUrl = this.route.url;
    //hide header footer
    this.visible =
      currentUrl == '/login' ||
      currentUrl == '/register' ||
      currentUrl == '/forgot' || 
      currentUrl == '/'
        ? false
        : true;
  }
}
