from .models import Notification, WaitlistEntry, Registration
from django.core.mail import send_mail
from django.conf import settings
def send_email_notification(user, subject, message):
    """
    Send email notification to user
    """
    try:
        if user.email:
            send_mail(
                subject,
                message,
                getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@evex.com'),
                [user.email],
                fail_silently=False,
            )
            return True
    except Exception as e:
        print(f"Failed to send email: {e}")
    return False
def send_notification(user, title, message, notification_type, related_event=None):
    """Utility function to send notifications"""
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        related_event=related_event
    )
    
    # Also send email for important notifications
    if notification_type in ['registration_confirmation', 'waitlist_promotion', 'event_cancelled']:
        send_email_notification(user, title, message)
    
    return notification

def promote_from_waitlist(event):
    """Promote first user from waitlist when a spot opens"""
    if not event.is_full:
        next_waitlist = WaitlistEntry.objects.filter(event=event).order_by('position').first()
        if next_waitlist:
            # Register the user
            Registration.objects.create(
                event=event,
                user=next_waitlist.user,
                status='registered'
            )
            
            # Remove from waitlist
            next_waitlist.delete()
            
            # Update positions for remaining waitlist entries
            remaining_entries = WaitlistEntry.objects.filter(event=event).order_by('position')
            for idx, entry in enumerate(remaining_entries, 1):
                entry.position = idx
                entry.save()
            
            # Send notification to promoted user
            send_notification(
                user=next_waitlist.user,
                title="Waitlist Promotion",
                message=f"You've been promoted from waitlist for {event.title}",
                notification_type='waitlist_promotion',
                related_event=event
            )
            
            return True
    return False