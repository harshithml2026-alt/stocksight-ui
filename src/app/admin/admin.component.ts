import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { AdminService, IpRow, AdminSession, AdminStats, SessionDetail, PagedResult } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, DatePipe, NgClass, MarkdownModule, RouterLink],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  stats: AdminStats | null = null;

  ips: IpRow[] = [];
  ipPage = 1;
  ipPageSize = 15;
  ipTotal = 0;
  ipTotalPages = 1;
  ipLoading = false;
  sortBy = 'last_active';
  sortDir = 'desc';
  locationMap: Record<string, string> = {};
  locationLoading = false;

  selectedIp: string | null = null;
  sessions: AdminSession[] = [];
  sessionPage = 1;
  sessionPageSize = 10;
  sessionTotal = 0;
  sessionTotalPages = 1;
  sessionLoading = false;

  openedSession: SessionDetail | null = null;
  sessionDetailLoading = false;
  confirmDeleteId: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadStats();
    this.loadIps();
  }

  loadStats() {
    this.adminService.getStats().subscribe(s => this.stats = s);
  }

  sortBy2(field: string) {
    if (this.sortBy === field) {
      this.sortDir = this.sortDir === 'desc' ? 'asc' : 'desc';
    } else {
      this.sortBy = field;
      this.sortDir = 'desc';
    }
    this.ipPage = 1;
    this.loadIps();
  }

  loadIps() {
    this.ipLoading = true;
    this.adminService.getIps(this.ipPage, this.ipPageSize, this.sortBy, this.sortDir).subscribe(res => {
      this.ips = res.items;
      this.ipTotal = res.total;
      this.ipTotalPages = res.total_pages;
      this.ipLoading = false;
      this.loadLocations(res.items.map(r => r.ip_address));
    });
  }

  loadLocations(ips: string[]) {
    if (!ips.length) return;
    this.locationLoading = true;
    this.adminService.getIpLocations(ips).subscribe(map => {
      this.locationMap = { ...this.locationMap, ...map };
      this.locationLoading = false;
    });
  }

  selectIp(ip: string) {
    if (this.selectedIp === ip) {
      this.selectedIp = null;
      this.sessions = [];
      return;
    }
    this.selectedIp = ip;
    this.sessionPage = 1;
    this.loadSessions();
  }

  loadSessions() {
    if (!this.selectedIp) return;
    this.sessionLoading = true;
    this.adminService.getSessionsForIp(this.selectedIp, this.sessionPage, this.sessionPageSize).subscribe(res => {
      this.sessions = res.items;
      this.sessionTotal = res.total;
      this.sessionTotalPages = res.total_pages;
      this.sessionLoading = false;
    });
  }

  ipPageChange(delta: number) {
    this.ipPage = Math.max(1, Math.min(this.ipTotalPages, this.ipPage + delta));
    this.loadIps();
  }

  sessionPageChange(delta: number) {
    this.sessionPage = Math.max(1, Math.min(this.sessionTotalPages, this.sessionPage + delta));
    this.loadSessions();
  }

  openSession(id: string) {
    this.sessionDetailLoading = true;
    this.openedSession = null;
    this.adminService.getSession(id).subscribe(s => {
      this.openedSession = s;
      this.sessionDetailLoading = false;
    });
  }

  closeSession() {
    this.openedSession = null;
  }

  promptDelete(id: string, event: Event) {
    event.stopPropagation();
    this.confirmDeleteId = id;
  }

  cancelDelete(event: Event) {
    event.stopPropagation();
    this.confirmDeleteId = null;
  }

  confirmDelete(id: string, event: Event) {
    event.stopPropagation();
    this.adminService.deleteSession(id).subscribe(() => {
      this.confirmDeleteId = null;
      this.sessions = this.sessions.filter(s => s.id !== id);
      this.sessionTotal--;
      if (this.openedSession?.id === id) this.openedSession = null;
      this.loadStats();
    });
  }

  formatDate(ms: number): string {
    return new Date(ms).toLocaleString();
  }

  timeAgo(ms: number): string {
    const diff = Date.now() - ms;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }
}
