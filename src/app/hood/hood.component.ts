import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-hood',
  imports: [RouterLink],
  templateUrl: './hood.component.html',
})
export class HoodComponent {
  diagramOpen = false;
  zoom = 1;
  panX = 0;
  panY = 0;
  isPinching = false;
  isDragging = false;

  private hasDragged = false;
  private lastPinchDist = 0;
  private lastZoomAtPinchStart = 1;
  private lastPanAtPinchStart = { x: 0, y: 0 };
  private dragStart = { x: 0, y: 0 };
  private panAtDragStart = { x: 0, y: 0 };
  private lastSingleTouch = { x: 0, y: 0 };

  constructor(private router: Router) {}

  goHome() { this.router.navigate(['/']); }

  get imgTransform() {
    return `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
  }

  get imgTransition() {
    return this.isPinching || this.isDragging ? 'none' : 'transform 0.15s ease';
  }

  openDiagram() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.diagramOpen = true;
  }

  closeDiagram() {
    this.diagramOpen = false;
  }

  onBackdropClick() {
    if (!this.hasDragged) this.closeDiagram();
    this.hasDragged = false;
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.zoom = Math.min(5, Math.max(0.5, this.zoom + delta));
  }

  onMouseDown(event: MouseEvent) {
    if (event.button !== 0) return;
    this.isDragging = true;
    this.hasDragged = false;
    this.dragStart = { x: event.clientX, y: event.clientY };
    this.panAtDragStart = { x: this.panX, y: this.panY };
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    const dx = event.clientX - this.dragStart.x;
    const dy = event.clientY - this.dragStart.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.hasDragged = true;
    this.panX = this.panAtDragStart.x + dx;
    this.panY = this.panAtDragStart.y + dy;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }

  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
      event.preventDefault();
      this.isPinching = true;
      this.lastPinchDist = this.pinchDist(event);
      this.lastZoomAtPinchStart = this.zoom;
      this.lastPanAtPinchStart = { x: this.panX, y: this.panY };
    } else if (event.touches.length === 1) {
      this.lastSingleTouch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      this.panAtDragStart = { x: this.panX, y: this.panY };
    }
  }

  onTouchMove(event: TouchEvent) {
    if (event.touches.length === 2 && this.isPinching) {
      event.preventDefault();
      const dist = this.pinchDist(event);
      const scale = dist / this.lastPinchDist;
      this.zoom = Math.min(5, Math.max(0.5, this.lastZoomAtPinchStart * scale));
    } else if (event.touches.length === 1 && !this.isPinching && this.zoom > 1) {
      event.preventDefault();
      const dx = event.touches[0].clientX - this.lastSingleTouch.x;
      const dy = event.touches[0].clientY - this.lastSingleTouch.y;
      this.panX += dx;
      this.panY += dy;
      this.lastSingleTouch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
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
