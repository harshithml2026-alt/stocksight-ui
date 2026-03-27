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

  placeholder = [
    "Pick a company above and ask away...",
    "What do you want to know about any of them?",
    "Try asking about NVIDIA's latest earnings...",
    "Dig into any of the 7 companies above...",
    "Ask anything grounded in SEC filings...",
    "What's on your mind — revenue, debt, risk?",
    "Curious about Apple's cash? Just ask.",
    "Ask about any company in the lineup...",
    "What would you like to know about Tesla?",
    "SEC data, plain English — ask anything.",
  ][Math.floor(Math.random() * 10)];

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
