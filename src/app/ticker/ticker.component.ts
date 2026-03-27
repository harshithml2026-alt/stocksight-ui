import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-ticker',
  imports: [NgFor],
  templateUrl: './ticker.component.html',
  styleUrl: './ticker.component.css',
})
export class TickerComponent {
  stocks = [
    { symbol: 'AAPL', name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', scale: 100, nudgeY: -5 },
    { symbol: 'GOOGL', name: 'Alphabet', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', scale: 100, nudgeY: 0 },
    { symbol: 'AMZN', name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Amazon_2024.svg', scale: 100, nudgeY: 0 },
    { symbol: 'META', name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', scale: 115, nudgeY: 0 },
    { symbol: 'TSLA', name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg', scale: 130, nudgeY: 0 },
    { symbol: 'MSFT', name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', scale: 135, nudgeY: 0 },
    { symbol: 'NVDA', name: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/NVIDIA_logo.svg', scale: 120, nudgeY: 0 },
  ];
}
