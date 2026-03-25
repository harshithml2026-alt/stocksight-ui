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
  isPinching = false;

  private lastPinchDist = 0;
  private lastZoomAtPinchStart = 1;

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

  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
      event.preventDefault();
      this.isPinching = true;
      this.lastPinchDist = this.pinchDist(event);
      this.lastZoomAtPinchStart = this.zoom;
    }
  }

  onTouchMove(event: TouchEvent) {
    if (event.touches.length === 2 && this.isPinching) {
      event.preventDefault();
      const dist = this.pinchDist(event);
      const scale = dist / this.lastPinchDist;
      this.zoom = Math.min(5, Math.max(0.5, this.lastZoomAtPinchStart * scale));
    }
  }

  onTouchEnd() {
    this.isPinching = false;
  }

  private pinchDist(event: TouchEvent): number {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.diagramOpen) this.closeDiagram();
  }
}
