// app/dashboard/student/my-events/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, MoreVertical, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { authService } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

type EventStatus = 'registered' | 'attended' | 'cancelled';

interface Event {
  id: string;
  registration_id: string;
  title: string;
  date_time: string;
  duration: number;
  description: string;
  status: EventStatus;
  category_name: string;
  image_url?: string;
  location?: string;
  registered_at: string;
  check_in_time?: string;
  capacity?: number;
  requirements?: string;
}

export default function MyEventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<EventStatus | 'all'>('all');
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        // Check authentication using Django backend
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        // Fetch user's event registrations from Django backend
        const registrationsResponse = await apiClient.get<any[]>('/registrations/my-registrations/');
        
        if (registrationsResponse.data) {
          // Transform the data to match our interface
          const eventsWithStatus: Event[] = registrationsResponse.data.map(reg => ({
            id: reg.event?.id || 'unknown',
            registration_id: reg.id,
            title: reg.event?.title || 'Unknown Event',
            date_time: reg.event?.date_time || new Date().toISOString(),
            duration: reg.event?.duration || 0,
            description: reg.event?.description || 'No description available',
            status: reg.status as EventStatus,
            category_name: reg.event?.category?.name || 'General',
            image_url: reg.event?.image_url,
            location: reg.event?.location,
            capacity: reg.event?.capacity,
            requirements: reg.event?.requirements,
            registered_at: reg.registered_at,
            check_in_time: reg.check_in_time
          }));

          setMyEvents(eventsWithStatus);
        }

      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [router]);

  const filteredEvents = myEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.category_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || event.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: EventStatus) => {
    const statusConfig = {
      registered: { label: "Registered", variant: "default" as const },
      attended: { label: "Attended", variant: "outline" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Technology: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Programming: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Career: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Workshop: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      General: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      Science: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      Arts: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      Sports: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  const handleCancelRegistration = async (registrationId: string) => {
    try {
      const response = await apiClient.put(`/registrations/${registrationId}/cancel/`, {});
      
      if (!response.error) {
        // Update local state
        setMyEvents(prev => prev.map(event => 
          event.registration_id === registrationId ? { ...event, status: 'cancelled' } : event
        ));
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error cancelling registration:', error);
      alert('Failed to cancel registration. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEventImage = (event: Event) => {
    if (event.image_url) {
      return event.image_url;
    }
    // Return a default image based on category
    const categoryImages: { [key: string]: string } = {
      Technology: '/images/tech-default.jpg',
      Programming: '/images/code-default.jpg',
      Career: '/images/career-default.jpg',
      Workshop: '/images/workshop-default.jpg',
    };
    return categoryImages[event.category_name] || '/images/event-default.jpg';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Events</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Manage and view all your registered events
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search events by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'registered', 'attended', 'cancelled'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  onClick={() => setFilter(status)}
                  className="capitalize"
                  size="sm"
                >
                  {status === 'all' ? 'All Events' : status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.registration_id} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            {/* Event Image */}
            <div className="relative h-40 bg-slate-200 dark:bg-slate-700">
              <img 
                src={getEventImage(event)} 
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/event-default.jpg';
                }}
              />
              <div className="absolute top-3 right-3">
                {getStatusBadge(event.status)}
              </div>
            </div>

            <CardHeader className="pb-3 grow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Badge className={getCategoryColor(event.category_name)}>
                      {event.category_name}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                {event.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="truncate">{formatDate(event.date_time)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{formatTime(event.date_time)}</span>
                  {event.duration > 0 && (
                    <span className="text-slate-500 text-xs">• {event.duration} min</span>
                  )}
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
                {event.capacity && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="text-xs font-medium">Capacity: {event.capacity}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" size="sm">
                  View Details
                </Button>
                {event.status === 'registered' && (
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel your registration for this event?')) {
                        handleCancelRegistration(event.registration_id);
                      }
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>

              {event.registered_at && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Registered on {formatDate(event.registered_at)} at {formatTime(event.registered_at)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No events found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {searchTerm || filter !== 'all' 
                ? "No events match your search criteria. Try adjusting your search or filters."
                : "You haven't registered for any events yet. Start exploring events to get involved!"}
            </p>
            <Button className="mt-4" asChild>
              <a href="/events">Browse All Events</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      {filteredEvents.length > 0 && (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {myEvents.filter(e => e.status === 'registered').length}
                </span>
                <span>Registered</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {myEvents.filter(e => e.status === 'attended').length}
                </span>
                <span>Attended</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {myEvents.filter(e => e.status === 'cancelled').length}
                </span>
                <span>Cancelled</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {myEvents.length}
                </span>
                <span>Total</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}