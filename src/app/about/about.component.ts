import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  diagramOpen = false;
  zoom = 1;

  constructor(private router: Router) {}

  goHome() { this.router.navigate(['/']); }

  openDiagram() {
    this.zoom = 1;
    this.diagramOpen = true;
  }

  closeDiagram() {
    this.diagramOpen = false;
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.zoom = Math.min(5, Math.max(0.5, this.zoom + delta));
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.diagramOpen) this.closeDiagram();
  }
}
