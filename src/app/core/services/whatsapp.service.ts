import { Injectable } from '@angular/core';
import { Product, ProductVariant } from '../models/product.model';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private readonly number = APP_CONSTANTS.WHATSAPP_NUMBER;

  openEnquiry(product: Product, selectedVariant: ProductVariant): void {
    const message = this.buildMessage(product, selectedVariant);
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${this.number}?text=${encoded}`, '_blank');
  }

  openGeneralEnquiry(): void {
    const message = `Hello Annai Aqua Tech,\n\nI am interested in your water purifier products and would like to schedule a free demo.\n\nPlease contact me at your earliest convenience.\n\nThank you.`;
    window.open(`https://wa.me/${this.number}?text=${encodeURIComponent(message)}`, '_blank');
  }

  openDemoRequest(productName?: string): void {
    const message = productName
      ? `Hello Annai Aqua Tech,\n\nI would like to request a FREE DEMO for:\n\nProduct: ${productName}\n\nPlease confirm a convenient time for installation demo.\n\nThank you.`
      : `Hello Annai Aqua Tech,\n\nI would like to request a FREE HOME DEMO for your water purifier range.\n\nPlease get in touch at your earliest.\n\nThank you.`;
    window.open(`https://wa.me/${this.number}?text=${encodeURIComponent(message)}`, '_blank');
  }

  private buildMessage(product: Product, variant: ProductVariant): string {
    return `Hello Annai Aqua Tech,

I am interested in the following product:

Product: ${product.name}
Color / Finish: ${variant.colorName}
Price: ₹${product.price.toLocaleString('en-IN')}
Capacity: ${product.capacity}

Please share more details and availability.

Thank you.`;
  }
}
