from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'universities', views.UniversityViewSet, basename='university')
router.register(r'profiles', views.UserProfileViewSet, basename='profile')
router.register(r'venues', views.VenueViewSet, basename='venue')
router.register(r'categories', views.EventCategoryViewSet, basename='category')
router.register(r'events', views.EventViewSet, basename='event')
router.register(r'registrations', views.RegistrationViewSet, basename='registration')
router.register(r'waitlist', views.WaitlistEntryViewSet, basename='waitlist')
router.register(r'attendance', views.AttendanceViewSet, basename='attendance')
router.register(r'feedback', views.FeedbackViewSet, basename='feedback')
router.register(r'notifications', views.NotificationViewSet, basename='notification')

# Admin routes
router.register(r'admin/events', views.AdminEventViewSet, basename='admin-event')
router.register(r'admin/users', views.AdminUserViewSet, basename='admin-user')
router.register(r'admin/universities', views.AdminUniversityViewSet, basename='admin-university')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.register_user, name='register'),
    path('analytics/', views.event_analytics, name='analytics'),
    path('organizer/dashboard/', views.organizer_dashboard, name='organizer-dashboard'),  # Add this line
]