import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatIconModule, MatButtonModule, MatTabsModule, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isDarkMode = false;
  isRotating = false;

  constructor(private router: Router) {}

  toggleTheme() {
    this.isRotating = true;

    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    document.body.classList.toggle('light-theme', !this.isDarkMode);

    setTimeout(() => {
      this.isRotating = false;
    }, 800);
  }

  onChange(event: MatTabChangeEvent){
    const routes = ['', '/request-form', '/history', '/approve-request'];
    this.router.navigate([routes[event.index]]);
  }
}

