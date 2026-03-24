import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TickerComponent } from '../ticker/ticker.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterLink, TickerComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  query = '';

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
