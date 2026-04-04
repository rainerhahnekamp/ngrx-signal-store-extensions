import { Component, effect, inject } from '@angular/core';
import { MessageStore } from './message.store';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styles: [
    `
      :host {
        position: fixed;
        top: calc(64px + 0.75rem + env(safe-area-inset-top, 0px));
        left: 50%;
        translate: -50% 0;
        z-index: 1100;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
        width: min(24rem, calc(100vw - 2rem));
        box-sizing: border-box;
        pointer-events: none;
      }

      @keyframes message-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .message-toast {
        opacity: 1;
        width: 100%;
        pointer-events: auto;
      }

      .message-toast-enter {
        animation: message-fade-in 400ms ease-out;
      }

      .message-toast-leaving {
        opacity: 0;
        transition: opacity 400ms ease-out;
      }

      .error {
        background: #f44336;
        color: white;
      }

      .info {
        background: #2193b0;
        color: white;
      }
    `,
  ],
  imports: [MatIconModule, NgClass],
})
export class MessageComponent {
  protected readonly messageStore = inject(MessageStore);

  constructor() {
    effect(
      () => {
        const messages = this.messageStore.messages();
        setTimeout(() => {
          for (const message of messages) {
            this.messageStore.remove(message);
          }
        }, 1500);
      },
      { debugName: 'messageCleanup' },
    );
  }
}
