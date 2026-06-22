import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import emailjs from '@emailjs/browser';
import { APP_CONSTANTS } from '../../core/constants/app.constants';

// ── Replace these with your EmailJS credentials ──────────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
// ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private fb = inject(FormBuilder);

  contact = APP_CONSTANTS.CONTACT_INFO;

  contactItems = [
    {
      label: 'Address',
      value: APP_CONSTANTS.CONTACT_INFO.address,
      icon: 'location_on',
      bgClass: 'bg-blue-100 dark:bg-blue-900/30',
      iconClass: 'text-blue-600 dark:text-blue-400',
      href: null as string | null,
    },
    {
      label: 'Phone',
      value: APP_CONSTANTS.CONTACT_INFO.phone,
      icon: 'phone',
      bgClass: 'bg-green-100 dark:bg-green-900/30',
      iconClass: 'text-green-600 dark:text-green-400',
      href: 'tel:' + APP_CONSTANTS.CONTACT_INFO.phone,
    },
    {
      label: 'Email',
      value: APP_CONSTANTS.CONTACT_INFO.email,
      icon: 'email',
      bgClass: 'bg-cyan-100 dark:bg-cyan-900/30',
      iconClass: 'text-cyan-600 dark:text-cyan-400',
      href: 'mailto:' + APP_CONSTANTS.CONTACT_INFO.email,
    },
    {
      label: 'Business Hours',
      value: APP_CONSTANTS.CONTACT_INFO.hours,
      icon: 'schedule',
      bgClass: 'bg-orange-100 dark:bg-orange-900/30',
      iconClass: 'text-orange-600 dark:text-orange-400',
      href: null as string | null,
    },
  ];

  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal(false);
  errorMessage = signal('');

  enquiryTypes = [
    'Home RO Purifier',
    'Office Water Dispenser',
    'Commercial RO Plant',
    'Annual Maintenance (AMC)',
    'Filter Replacement',
    'Other',
  ];

  form = this.fb.group({
    name:        ['', [Validators.required, Validators.minLength(2)]],
    mobile:      ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    email:       ['', [Validators.required, Validators.email]],
    enquiryType: ['', Validators.required],
    message:     ['', [Validators.required, Validators.minLength(10)]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);
    this.submitError.set(false);

    const { name, mobile, email, enquiryType, message } = this.form.value;

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:    name ?? '',
          from_mobile:  mobile ?? '',
          from_email:   email ?? '',
          enquiry_type: enquiryType ?? '',
          message:      message ?? '',
          to_name:      'Annai Aqua Tech',
          reply_to:     email ?? '',
        },
        EMAILJS_PUBLIC_KEY
      );
      this.submitSuccess.set(true);
      this.form.reset();
      setTimeout(() => this.submitSuccess.set(false), 6000);
    } catch (err: unknown) {
      this.submitError.set(true);
      const e = err as { text?: string };
      this.errorMessage.set(e?.text ?? 'Something went wrong. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
