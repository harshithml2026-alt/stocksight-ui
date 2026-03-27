import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API = environment.apiUrl;

export interface IpRow {
  ip_address: string;
  session_count: number;
  last_active: number;
  first_seen: number;
}

export interface AdminSession {
  id: string;
  preview: string;
  createdAt: number;
  updatedAt: number;
  isArchived: boolean;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AdminStats {
  total_sessions: number;
  total_ips: number;
  active_sessions: number;
  archived_sessions: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SessionDetail {
  id: string;
  preview: string;
  ip_address: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${API}/admin/stats`);
  }

  getIps(page: number, pageSize: number, sortBy: string, sortDir: string): Observable<PagedResult<IpRow>> {
    const params = new HttpParams()
      .set('page', page)
      .set('page_size', pageSize)
      .set('sort_by', sortBy)
      .set('sort_dir', sortDir);
    return this.http.get<PagedResult<IpRow>>(`${API}/admin/sessions`, { params });
  }

  getIpLocations(ips: string[]): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(`${API}/admin/ip-locations`, ips);
  }

  getSession(id: string): Observable<SessionDetail> {
    return this.http.get<SessionDetail>(`${API}/chat/sessions/${id}`);
  }

  getSessionsForIp(ip: string, page: number, pageSize: number): Observable<PagedResult<AdminSession>> {
    const params = new HttpParams()
      .set('ip', ip)
      .set('page', page)
      .set('page_size', pageSize);
    return this.http.get<PagedResult<AdminSession>>(`${API}/admin/sessions/by-ip`, { params });
  }

  deleteSession(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/chat/sessions/${id}`);
  }
}
