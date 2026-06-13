from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.db.models import Q
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from .utils import send_notification, promote_from_waitlist

# Move IsOrganizerOrAdmin to the top, before any functions that use it
class IsOrganizerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            user_profile = request.user.profile
            return user_profile.user_type in ['organizer', 'admin'] or request.user.is_staff
        except UserProfile.DoesNotExist:
            return False

# Add this registration function
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user with profile
    """
    try:
        data = request.data
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'user_type']
        for field in required_fields:
            if field not in data:
                return Response(
                    {'error': f'{field} is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Check if username or email already exists
        if User.objects.filter(username=data['username']).exists():
            return Response(
                {'error': 'Username already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(email=data['email']).exists():
            return Response(
                {'error': 'Email already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create default university (you can modify this logic)
        university = University.objects.first()
        if not university:
            return Response(
                {'error': 'No universities available. Please contact administrator.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', '')
        )
        
        # Create user profile
        profile = UserProfile.objects.create(
            user=user,
            university=university,
            user_type=data['user_type'],
            contact_number=data.get('contact_number', ''),
            department=data.get('department', ''),
            is_verified=False  # Default to unverified
        )
        
        # Return user data
        user_data = UserSerializer(user).data
        
        return Response({
            'message': 'User registered successfully',
            'user': user_data,
            'profile': {
                'user_type': profile.user_type,
                'university': profile.university.name,
                'is_verified': profile.is_verified
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Add Analytics Endpoint
@api_view(['GET'])
@permission_classes([IsAdminUser])
def event_analytics(request):
    from django.db.models import Count, Q
    from datetime import datetime, timedelta
    
    # Basic stats
    total_events = Event.objects.count()
    published_events = Event.objects.filter(status='published').count()
    total_registrations = Registration.objects.filter(status='registered').count()
    total_users = User.objects.count()
    
    # User type breakdown
    student_count = UserProfile.objects.filter(user_type='student').count()
    organizer_count = UserProfile.objects.filter(user_type='organizer').count()
    admin_count = UserProfile.objects.filter(user_type='admin').count()
    
    # Recent activity (last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent_events = Event.objects.filter(created_at__gte=thirty_days_ago).count()
    recent_registrations = Registration.objects.filter(registered_at__gte=thirty_days_ago).count()
    
    # University stats
    university_stats = University.objects.annotate(
        event_count=Count('event'),
        student_count=Count('userprofile', filter=Q(userprofile__user_type='student'))
    ).values('name', 'event_count', 'student_count')
    
    # Event category distribution
    category_stats = EventCategory.objects.annotate(
        event_count=Count('event')
    ).values('name', 'event_count')
    
    # Popular events (top 5 by registrations)
    popular_events = Event.objects.annotate(
        registration_count=Count('registration')
    ).order_by('-registration_count')[:5].values('title', 'registration_count')
    
    return Response({
        'overview': {
            'total_events': total_events,
            'published_events': published_events,
            'total_registrations': total_registrations,
            'total_users': total_users,
            'student_count': student_count,
            'organizer_count': organizer_count,
            'admin_count': admin_count,
            'recent_events': recent_events,
            'recent_registrations': recent_registrations,
        },
        'university_stats': list(university_stats),
        'category_stats': list(category_stats),
        'popular_events': list(popular_events),
    })

# Add Organizer Dashboard Endpoint
@api_view(['GET'])
@permission_classes([IsOrganizerOrAdmin])
def organizer_dashboard(request):
    """
    Dashboard data for organizers
    """
    user = request.user
    from django.db.models import Count, Q
    from datetime import datetime, timedelta
    
    # Get organizer's events
    organizer_events = Event.objects.filter(organizer=user)
    total_events = organizer_events.count()
    published_events = organizer_events.filter(status='published').count()
    draft_events = organizer_events.filter(status='draft').count()
    
    # Registration stats for organizer's events
    total_registrations = Registration.objects.filter(
        event__organizer=user, 
        status='registered'
    ).count()
    
    # Recent events (last 7 days)
    seven_days_ago = datetime.now() - timedelta(days=7)
    recent_registrations = Registration.objects.filter(
        event__organizer=user,
        registered_at__gte=seven_days_ago
    ).count()
    
    # Upcoming events
    upcoming_events = organizer_events.filter(
        date_time__gte=datetime.now(),
        status='published'
    ).order_by('date_time')[:5]
    
    upcoming_events_data = EventSerializer(upcoming_events, many=True).data
    
    # Events needing attention (full events with waitlists)
    full_events_with_waitlist = organizer_events.filter(
        is_full=True
    ).annotate(
        waitlist_count=Count('waitlistentry')
    ).filter(waitlist_count__gt=0)
    
    return Response({
        'overview': {
            'total_events': total_events,
            'published_events': published_events,
            'draft_events': draft_events,
            'total_registrations': total_registrations,
            'recent_registrations': recent_registrations,
        },
        'upcoming_events': upcoming_events_data,
        'full_events_count': full_events_with_waitlist.count(),
    })

# Your existing ViewSets continue below...
class UniversityViewSet(viewsets.ModelViewSet):
    queryset = University.objects.filter(is_active=True)
    serializer_class = UniversitySerializer
    permission_classes = [IsAuthenticated]

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=self.request.user)

class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.filter(is_active=True)
    serializer_class = VenueSerializer
    permission_classes = [IsAuthenticated]

class EventCategoryViewSet(viewsets.ModelViewSet):
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    permission_classes = [IsAuthenticated]

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsOrganizerOrAdmin()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        
        # For staff users, show all events
        if user.is_staff:
            return Event.objects.all()
            
        # For regular users, check if they have a profile
        try:
            user_university = user.profile.university
        except UserProfile.DoesNotExist:
            # If no profile exists, return empty queryset
            return Event.objects.none()
        
        # Base queryset for published events
        queryset = Event.objects.filter(status='published')
        
        # Filter by university visibility
        queryset = queryset.filter(
            Q(visibility='public') |
            Q(visibility='university', host_university=user_university) |
            Q(visibility='inter_university', allowed_universities=user_university)
        ).distinct()
        
        # Search and filter parameters
        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        university = self.request.query_params.get('university')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
        if category:
            queryset = queryset.filter(category_id=category)
        if university:
            queryset = queryset.filter(host_university_id=university)
        if date_from:
            queryset = queryset.filter(date_time__date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date_time__date__lte=date_to)
            
        return queryset.order_by('date_time')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        event = self.get_object()
        user = request.user
        
        # Check if user has a profile
        try:
            user_profile = user.profile
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'User profile not found. Please complete your profile.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already registered
        existing_reg = Registration.objects.filter(event=event, user=user).first()
        if existing_reg:
            return Response(
                {'error': 'Already registered for this event'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check university eligibility
        user_university = user_profile.university
        if event.visibility == 'university' and user_university != event.host_university:
            return Response(
                {'error': 'This event is only for students of the host university'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        elif event.visibility == 'inter_university' and user_university not in event.allowed_universities.all():
            return Response(
                {'error': 'Your university is not allowed for this event'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if event.is_full:
            # Add to waitlist
            waitlist_position = WaitlistEntry.objects.filter(event=event).count() + 1
            WaitlistEntry.objects.create(event=event, user=user, position=waitlist_position)
            
            send_notification(
                user=user,
                title="Added to Waitlist",
                message=f"You've been added to waitlist for {event.title} (Position: {waitlist_position})",
                notification_type='waitlist_promotion',
                related_event=event
            )
            
            return Response({'status': 'added_to_waitlist', 'position': waitlist_position})
        else:
            # Register directly
            registration = Registration.objects.create(event=event, user=user)
            
            send_notification(
                user=user,
                title="Registration Confirmed",
                message=f"You've successfully registered for {event.title}",
                notification_type='registration_confirmation',
                related_event=event
            )
            
            serializer = RegistrationSerializer(registration)
            return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel_registration(self, request, pk=None):
        event = self.get_object()
        user = request.user
        
        registration = Registration.objects.filter(event=event, user=user).first()
        if not registration:
            return Response(
                {'error': 'Not registered for this event'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        registration.status = 'cancelled'
        registration.save()
        
        # Promote from waitlist
        promote_from_waitlist(event)
        
        send_notification(
            user=user,
            title="Registration Cancelled",
            message=f"Your registration for {event.title} has been cancelled",
            notification_type='event_cancelled',
            related_event=event
        )
        
        return Response({'status': 'registration_cancelled'})

# FIXED ViewSets with queryset defined
class RegistrationViewSet(viewsets.ModelViewSet):
    serializer_class = RegistrationSerializer
    permission_classes = [IsAuthenticated]
    
    # Add queryset at class level
    queryset = Registration.objects.all()

    def get_queryset(self):
        return Registration.objects.filter(user=self.request.user)

class WaitlistEntryViewSet(viewsets.ModelViewSet):
    serializer_class = WaitlistEntrySerializer
    permission_classes = [IsAuthenticated]
    
    # Add queryset at class level
    queryset = WaitlistEntry.objects.all()

    def get_queryset(self):
        return WaitlistEntry.objects.filter(user=self.request.user)

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAdminUser]

class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]
    
    # Add queryset at class level
    queryset = Feedback.objects.all()

    def get_queryset(self):
        return Feedback.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    # Add queryset at class level
    queryset = Notification.objects.all()

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all_notifications_marked_read'})

# Admin-only endpoints
class AdminEventViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class AdminUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class AdminUniversityViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = University.objects.all()
    serializer_class = UniversitySerializer