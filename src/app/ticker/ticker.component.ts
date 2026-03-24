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
    { symbol: 'NVDA', name: 'NVIDIA', color: '#76b900', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/NVIDIA_logo.svg', size: 'w-16 h-16' },
    { symbol: 'MSFT', name: 'Microsoft', color: '#00a4ef', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', size: 'w-16 h-16' },
    { symbol: 'AAPL', name: 'Apple', color: '#a2aaad', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', size: 'w-7 h-7' },
    { symbol: 'GOOGL', name: 'Alphabet', color: '#4285f4', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', size: 'w-10 h-10' },
    { symbol: 'AMZN', name: 'Amazon', color: '#ff9900', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Amazon_2024.svg', size: 'w-10 h-10' },
    { symbol: 'TSLA', name: 'Tesla', color: '#e82127', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg', size: 'w-8 h-8' },
    { symbol: 'META', name: 'Meta', color: '#0866ff', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', size: 'w-16 h-16' },
    { symbol: 'JPM', name: 'JPMorgan', color: '#005eb8', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Logo_of_JPMorganChase_2024.svg', size: 'w-20 h-20' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', color: '#cc0000', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/JNJ_Logo_New.svg', size: 'w-14 h-14' },
    { symbol: 'XOM', name: 'ExxonMobil', color: '#e31837', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/ExxonMobil_Logo.svg', size: 'w-16 h-16' },
    { symbol: 'WMT', name: 'Walmart', color: '#0071ce', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Walmart_logo_%282025%29.svg', size: 'w-16 h-16' },
    { symbol: 'BA', name: 'Boeing', color: '#1d4f91', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Boeing_full_logo.svg', size: 'w-16 h-16' },
    { symbol: 'PFE', name: 'Pfizer', color: '#0093c8', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Pfizer_logo.svg', size: 'w-14 h-14' },
  ];
}
