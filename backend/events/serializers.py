from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university.name', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

class VenueSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university.name', read_only=True)
    
    class Meta:
        model = Venue
        fields = '__all__'

class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    organizer_name = serializers.CharField(source='organizer.get_full_name', read_only=True)
    university_name = serializers.CharField(source='host_university.name', read_only=True)
    venue_name = serializers.CharField(source='venue.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    registered_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    user_registration_status = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField() 
    class Meta:
        model = Event
        fields = '__all__'
    
    def get_user_registration_status(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            registration = Registration.objects.filter(event=obj, user=request.user).first()
            return registration.status if registration else None
        return None
    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None
    
class RegistrationSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Registration
        fields = '__all__'

class WaitlistEntrySerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = WaitlistEntry
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Attendance
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Feedback
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='related_event.title', read_only=True)
    
    class Meta:
        model = Notification
        fields = '__all__'