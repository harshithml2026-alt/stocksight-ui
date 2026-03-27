import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TickerComponent } from '../ticker/ticker.component';
import { SUGGESTIONS } from './suggestions';

@Component({
  selector: 'app-home',
  imports: [FormsModule, NgFor, RouterLink, TickerComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  query = '';

  suggestions = SUGGESTIONS
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  constructor(private router: Router) {}

  ask() {
    if (!this.query.trim()) return;
    const sessionId = crypto.randomUUID();
    this.router.navigate(['/chat', sessionId], { state: { query: this.query.trim() } });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.ask();
  }
}
