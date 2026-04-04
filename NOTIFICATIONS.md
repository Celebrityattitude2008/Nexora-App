# Smart Notifications Setup Guide

## Overview

Your Nexora dashboard now includes a comprehensive OneSignal push notification system with intelligent triggers that keep you engaged and productive.

## Notification Triggers Implemented

### 1. **⚡ High Priority Task Alerts**
- **When**: A high-priority task hasn't been completed after 2+ hours of creation
- **Frequency**: Checked every minute, notified every 30 minutes
- **Message**: `"Task Title" is still pending. Make progress today!`
- **Use Case**: Reminds you about urgent work that needs immediate attention

### 2. **🎯 Daily Goal Reminders**
- **When**: A goal created today hasn't been started by 6 AM
- **Frequency**: Checked every minute, notified once per hour
- **Message**: `Don't forget: "Goal Name" (Category)`
- **Use Case**: Helps you stay consistent with daily habits and goals

### 3. **📊 Weekly Productivity Summary**
- **When**: Every Sunday at 9 PM
- **Frequency**: Once per week
- **Message**: `You completed X tasks this week! Completion rate: Y%, Avg progress: Z%`
- **Data**: Shows your weekly statistics
- **Use Case**: Reflects on your productivity and progress

### 4. **⏰ Inactivity Check-in**
- **When**: No user activity detected for 4 hours
- **Frequency**: Once per inactivity period
- **Message**: `You've been inactive for a while. How about reviewing your progress?`
- **Use Case**: Encourages periodic review of your dashboard

## Configuration

### OneSignal App ID
The notification system is configured with the following app ID:
```
NEXT_PUBLIC_ONESIGNAL_APP_ID=eb3fd719-274c-4e0c-ba1b-14a87d504eee
```

To use your own OneSignal account:
1. Create a free account at [OneSignal.com](https://onesignal.com)
2. Create a new Web App
3. Replace the app ID in `.env.local`:
   ```
   NEXT_PUBLIC_ONESIGNAL_APP_ID=your-app-id-here
   ```

## How It Works

### Activity Tracking
The system tracks user interactions:
- **Mouse clicks** - User is active
- **Keyboard input** - User is active
- **Page scrolling** - User is active

Inactivity is calculated from the last detected activity.

### Smart Notification Logic
- **Task Deadline Monitoring**: Continuously monitors high-priority incomplete tasks
- **Goal Progress Tracking**: Checks if daily goals have been started
- **Weekly Analytics**: Calculates and sends productivity metrics
- **Activity Awareness**: Knows when you're using the dashboard

### Data Persistence
Notifications work seamlessly with your Firebase-backed data:
- Tasks and goals sync in real-time
- Notification triggers respond to actual task/goal data
- All metrics are calculated from live data

## User Permissions

When you first open the dashboard, your browser will ask for notification permissions:

```
Would you like to allow notifications from nexora-dashboard?
[Allow] [Block]
```

Click **Allow** to receive notifications. You can change this later in browser settings:
- **Chrome**: Settings → Privacy → Site settings → Notifications
- **Firefox**: Preferences → Privacy → Permissions → Notifications
- **Safari**: System Preferences → Websites → Notifications

## Testing Notifications

To test the notification system:

1. **Task Deadline Test**: Create a high-priority task and wait 2+ hours. You'll receive a notification.

2. **Goal Reminder Test**: Create a goal early in the morning. If it's not started by 6 AM, you'll get a reminder.

3. **Activity Monitor Test**: Leave the page inactive for 4 hours. You'll receive an inactivity check-in.

4. **Weekly Summary Test**: Wait until Sunday 9 PM for your weekly productivity report.

## Notification Data

Each notification includes metadata:

```typescript
{
  type: 'task-deadline' | 'missed-goal' | 'weekly-summary' | 'inactivity';
  title: string;         // Notification title with emoji
  message: string;       // Detailed message
  data?: {
    taskId?: string;
    taskTitle?: string;
    goalId?: string;
    goalLabel?: string;
    completedTasks?: string;
    completionRate?: string;
    avgProgress?: string;
  }
}
```

## Frequency & Performance

The notification system is optimized for performance:
- **Checks run every 1 minute** (checking is lightweight)
- **Notifications throttled** to prevent spam:
  - Task reminders: max 1 every 30 minutes per task
  - Goal reminders: max 1 every 60 minutes per goal
  - Weekly summary: max 1 per week
  - Inactivity alerts: max 1 per 4-hour period

## Disabling Notifications

To temporarily disable notifications:
1. Open browser DevTools (F12)
2. Go to Console
3. Run: `OneSignal?.pauseNotifications?.()` (pause) or `OneSignal?.resumeNotifications?.()` (resume)

Or adjust notification settings in your browser's site preferences.

## API Reference

### NotificationService Component
Location: `components/NotificationService.tsx`

The `NotificationService` component is a client-side component that:
- Initializes OneSignal SDK on mount
- Subscribes to Firebase tasks and goals
- Monitors user activity
- Manages notification triggers
- Handles notification sending

**Usage:**
```tsx
<NotificationService />
```

### Internal Functions
- `sendNotification(trigger)`: Sends a notification with given trigger data
- `checkTaskDeadlines()`: Monitors high-priority incomplete tasks
- `checkMissedGoals()`: Monitors daily goal progress
- `checkWeeklySummary()`: Generates and sends weekly reports
- `updateActivity()`: Tracks user interactions for inactivity detection

## Troubleshooting

### Notifications not showing?
1. Check browser notification permissions
2. Verify OneSignal app ID is correct
3. Check browser console for errors
4. Open DevTools → Application → Notifications

### Spam notifications?
- The system has built-in throttling
- Check notification frequency settings above
- Verify task/goal data is correct

### Integration issues?
1. Ensure `.env.local` has `NEXT_PUBLIC_ONESIGNAL_APP_ID`
2. Rebuild with `npm run build`
3. Check for console errors in DevTools

## Next Steps

- Enable notifications in your browser
- Create high-priority tasks to test alerts
- Set daily goals to receive reminders
- Monitor your weekly productivity reports
- Adjust notification triggers as needed

## Security Notes

- OneSignal is PCI-DSS Level 1 certified
- Notifications are encrypted in transit
- No personal data is stored beyond what you set
- Firebase handles all task/goal data
- All code runs client-side (no server processing)

---

**Last Updated**: April 4, 2026
**Notification SDK**: OneSignal v16
**Environment**: Next.js 14 with Firebase
