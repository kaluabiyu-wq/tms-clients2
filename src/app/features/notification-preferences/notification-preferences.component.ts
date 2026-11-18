import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationPreference } from '../../models/notification.model';
import { NotificationService } from '../../services/notification.service';

@Component({selector:'app-notification-preferences',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./notification-preferences.component.html',styleUrl:'./notification-preferences.component.scss'})
export class NotificationPreferencesComponent {
  private service=inject(NotificationService); readonly preference=signal<NotificationPreference>({category:'*',inAppEnabled:true,emailEnabled:false,smsEnabled:false}); readonly saving=signal(false); readonly message=signal('');
  constructor(){void this.load();}
  async load(){try{const rows=await this.service.getPreferences();const general=rows.find(x=>x.category==='*');if(general)this.preference.set({...general});}catch{this.message.set('Could not load preferences.');}}
  update(key:'inAppEnabled'|'emailEnabled'|'smsEnabled',value:boolean){this.preference.update(x=>({...x,[key]:value}));}
  async save(){this.saving.set(true);this.message.set('');try{await this.service.updatePreference(this.preference());this.message.set('Notification preferences saved.');}catch{this.message.set('Unable to save preferences.');}finally{this.saving.set(false);}}
}
