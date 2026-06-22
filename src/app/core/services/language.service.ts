import { Injectable } from '@angular/core';

// English-only service — Tamil support removed
@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly currentLanguage = 'en';
}
