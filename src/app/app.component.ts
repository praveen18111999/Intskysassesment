
import { Component, OnInit } from '@angular/core';
import { interval, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

interface Reminder {
  text: string;
  time: string; // HH:mm
  passed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentTime$ = new BehaviorSubject<Date>(new Date());
  fastMode = false;
  reminders: Reminder[] = [];

  newReminderText = '';
  newReminderTime = '';

  private subscription: Subscription = new Subscription(); 
  ngOnInit(): void {
    this.startTimer(60000); // 60 sec = 1 min
  }

  startTimer(ms: number) {
    if (this.subscription) this.subscription.unsubscribe();

    this.subscription = interval(1000).subscribe(() => {
      const current = this.currentTime$.value;
      const newTime = new Date(current.getTime() + (ms / 60));
      this.currentTime$.next(newTime);
      this.updateReminderStatus();
    });
  }

  toggleSpeed() {
    this.fastMode = !this.fastMode;
    this.startTimer(this.fastMode ? 1000 : 60000);
  }

  addReminder() {
    if (!this.newReminderText || !this.newReminderTime) return;

    this.reminders.push({
      text: this.newReminderText,
      time: this.newReminderTime,
      passed: false
    });

    this.newReminderText = '';
    this.newReminderTime = '';
  }

  updateReminderStatus() {
    const now = this.currentTime$.value;
    this.reminders.forEach(rem => {
      const [h, m] = rem.time.split(':').map(Number);
      const reminderTime = new Date(now);
      reminderTime.setHours(h, m, 0, 0);
      rem.passed = reminderTime <= now;
    });
  }

  getFormattedTime(date: Date): string {
    return date.toTimeString().substring(0, 5);
  }
}
