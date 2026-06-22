import { Component, inject } from '@angular/core';
import { WhatsappService } from '../../core/services/whatsapp.service';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  templateUrl: './whatsapp-button.component.html',
  styleUrl: './whatsapp-button.component.scss',
})
export class WhatsappButtonComponent {
  whatsapp = inject(WhatsappService);
}
