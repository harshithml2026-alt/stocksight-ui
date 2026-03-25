import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Session {
  id: string;
  preview: string;
  createdAt: number;
}

export interface Source {
  id: string;
  score: number;
  metadata: Record<string, any>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Source[];
}

export interface SessionDetail extends Session {
  ip_address: string;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface Metrics {
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  inference_time_sec: number;
  tokens_per_sec: number;
}

export interface ChatResponse {
  session_id: string;
  answer: string;
  sources: Source[];
  metrics?: Metrics;
}

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class SessionService {
  constructor(private http: HttpClient) {}

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${API}/chat/sessions`);
  }

  getSession(id: string): Observable<SessionDetail> {
    return this.http.get<SessionDetail>(`${API}/chat/sessions/${id}`);
  }

  sendMessage(question: string, sessionId?: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${API}/chat/message`, {
      question,
      session_id: sessionId ?? null,
    });
  }

  archiveSession(id: string): Observable<any> {
    return this.http.patch(`${API}/chat/sessions/${id}/archive`, {});
  }

  deleteSession(id: string): Observable<any> {
    return this.http.delete(`${API}/chat/sessions/${id}`);
  }
}
