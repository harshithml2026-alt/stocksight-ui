import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { skip } from 'rxjs';
import { MarkdownComponent } from 'ngx-markdown';
import { SessionService, Session, Source } from '../services/session.service';

interface Metrics {
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  inference_time_sec: number;
  tokens_per_sec: number;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
  metrics?: Metrics;
  sources?: Source[];
}

@Component({
  selector: 'app-chat',
  imports: [FormsModule, NgFor, NgIf, DatePipe, MarkdownComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  sessionId: string;
  messages: Message[] = [];
  input = '';
  isTyping = false;
  sidebarOpen = window.innerWidth >= 768;
  sessions: Session[] = [];
  activeMenu: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private sessionService: SessionService,
  ) {
    this.sessionId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  ngOnInit() {
    this.loadSessions();

    // Handle initial query passed via router state (from home page)
    const initialQuery = this.router.lastSuccessfulNavigation?.extras?.state?.['query'];
    if (initialQuery) {
      this.sessionId = '';
      this.sendQuestion(initialQuery);
    } else if (this.sessionId) {
      this.loadSessionMessages();
    }

    // React to session changes when navigating between sessions (skip initial emission)
    this.route.paramMap.pipe(skip(1)).subscribe(params => {
      const id = params.get('id') ?? '';
      if (id && id !== this.sessionId) {
        this.sessionId = id;
        this.messages = [];
        this.loadSessionMessages();
      }
    });
  }

  private loadSessions() {
    this.sessionService.getSessions().subscribe({
      next: (sessions) => (this.sessions = sessions),
      error: () => (this.sessions = []),
    });
  }

  private loadSessionMessages() {
    this.sessionService.getSession(this.sessionId).subscribe({
      next: (detail) => {
        this.messages = detail.messages.map((m) => ({
          role: m.role === 'assistant' ? 'ai' : 'user',
          text: m.content,
          sources: m.sources ?? [],
        }));
        this.scrollToBottom();
      },
      error: () => {},
    });
  }

  send() {
    if (!this.input.trim() || this.isTyping) return;
    const question = this.input.trim();
    this.input = '';
    this.sendQuestion(question);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private sendQuestion(question: string) {
    this.messages.push({ role: 'user', text: question });
    this.isTyping = true;
    this.scrollToBottom();

    this.sessionService
      .sendMessage(question, this.sessionId || undefined)
      .subscribe({
        next: (res) => {
          if (!this.sessionId) {
            this.sessionId = res.session_id;
            // Update URL without re-creating the component
            this.location.replaceState(`/chat/${this.sessionId}`);
            this.loadSessions();
          }
          this.isTyping = false;
          this.messages.push({ role: 'ai', text: res.answer, metrics: res.metrics ?? undefined, sources: res.sources ?? [] });
          this.scrollToBottom();
        },
        error: () => {
          this.isTyping = false;
          this.messages.push({
            role: 'ai',
            text: 'Something went wrong. Please try again.',
          });
          this.scrollToBottom();
        },
      });
  }

  openSession(id: string) {
    this.sidebarOpen = false;
    this.router.navigate(['/chat', id]);
  }

  toggleMenu(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.activeMenu = this.activeMenu === id ? null : id;
  }

  archiveSession(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.activeMenu = null;
    this.sessionService.archiveSession(id).subscribe({
      next: () => {
        this.sessions = this.sessions.filter((s) => s.id !== id);
        if (id === this.sessionId) this.router.navigate(['/']);
      },
    });
  }

  deleteSession(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.activeMenu = null;
    this.sessionService.deleteSession(id).subscribe({
      next: () => {
        this.sessions = this.sessions.filter((s) => s.id !== id);
        if (id === this.sessionId) this.router.navigate(['/']);
      },
    });
  }

  closeMenu() {
    this.activeMenu = null;
  }

  goHome() {
    this.router.navigate(['/']);
  }

  formatSources(sources: Source[]): string {
    const seen = new Set<string>();
    const parts: string[] = [];
    for (const src of sources) {
      const m = src.metadata;
      const ticker  = m['ticker'] || m['company'] || '';
      const filing  = m['filing_type'] || m['form_type'] || '';
      const rawDate = m['period_of_report'] || m['date'] || '';
      const year    = rawDate ? rawDate.toString().slice(0, 4) : '';
      const label   = [ticker, filing, year].filter(Boolean).join(' ');
      if (label && !seen.has(label)) {
        seen.add(label);
        parts.push(label);
      }
    }
    return parts.join(' | ');
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }
}
