// app/dashboard/student/registration/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authService } from '@/lib/auth';
import { apiClient } from '@/lib/api';

interface FormData {
  fullName: string;
  email: string;
  studentId: string;
  university: string;
  major: string;
  year: string;
  questions: string;
}

interface Event {
  id: string;
  title: string;
  date_time: string;
  duration: number;
  location: string;
  capacity: number;
  description: string;
  requirements: string;
  category: {
    name: string;
  };
  organizer: {
    name: string;
    email: string;
  };
}

export default function RegistrationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get('eventId');
  const [isRegistered, setIsRegistered] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    studentId: "",
    university: "",
    major: "",
    year: "",
    questions: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check authentication using Django backend
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        // Get user from auth service
        const currentUser = authService.getUser();
        if (!currentUser || currentUser.role !== 'student') {
          router.push('/dashboard');
          return;
        }

        setUser(currentUser);

        // Set form data from user profile
        setFormData({
          fullName: currentUser.name || "",
          email: currentUser.email || "",
          studentId: "", // You might want to add this field to your user model
          university: currentUser.university?.name || "",
          major: "Computer Science", // Add this field to your user model
          year: "2nd Year", // Add this field to your user model
          questions: ""
        });

        // Fetch event data if eventId is provided
        if (eventId) {
          const eventResponse = await apiClient.get<Event>(`/events/${eventId}/`);
          if (eventResponse.data) {
            setEvent(eventResponse.data);
          }

          // Check if user is already registered
          const registrationsResponse = await apiClient.get<any[]>('/registrations/my-registrations/');
          if (registrationsResponse.data) {
            const existingRegistration = registrationsResponse.data.find(
              reg => reg.event?.id === eventId
            );
            if (existingRegistration) {
              setIsRegistered(true);
            }
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);

    try {
      if (!event || !user) return;

      // Create registration in Django backend
      const response = await apiClient.post('/registrations/', {
        event_id: event.id,
        status: 'registered'
      });

      if (!response.error) {
        setIsRegistered(true);
      } else {
        throw new Error(response.error);
      }

    } catch (error) {
      console.error('Error registering for event:', error);
    } finally {
      setRegistering(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-4"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="lg:col-span-2">
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <CardContent className="p-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Event Not Found
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              The event you're trying to register for doesn't exist or is no longer available.
            </p>
            <Button asChild>
              <Link href="/events">
                Browse Events
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Registration Successful! 🎉
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              You have successfully registered for
            </p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              {event.title}
            </h3>
            
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 mb-6 text-left">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Event Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{new Date(event.date_time).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>{new Date(event.date_time).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                A confirmation email has been sent to <strong>{formData.email}</strong>
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/dashboard/student/my-events">
                    View My Events
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/events">
                    Browse More Events
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Navigation */}
      <Link href={`/events/${eventId}`} className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
        <ArrowLeft className="h-4 w-4" />
        Back to Event Details
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 sticky top-8">
            <CardHeader>
              <CardTitle>Event Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                  {event.title}
                </h3>
                <Badge className="mt-2">{event.category?.name}</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {new Date(event.date_time).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(event.date_time).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Capacity: {event.capacity} attendees
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Organizer:</strong> {event.organizer?.name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Contact:</strong> {event.organizer?.email}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>Event Registration</CardTitle>
              <CardDescription>
                Complete the form below to register for {event.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Personal Information</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input 
                        id="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Input 
                        id="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        required
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="major">Major/Field of Study</Label>
                      <Input 
                        id="major"
                        value={formData.major}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Academic Year</Label>
                      <Input 
                        id="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Questions */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Additional Information</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="questions">
                      Do you have any questions for the organizers or specific topics you'd like covered?
                    </Label>
                    <Textarea 
                      id="questions"
                      placeholder="Enter any questions or comments..."
                      value={formData.questions}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </div>

                {/* Event Requirements */}
                {event.requirements && (
                  <Card className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Event Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {event.requirements}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                        required
                        title="Agree to terms and conditions"
                        aria-label="I agree to the terms and conditions"
                      />
                    </div>
                    <div className="text-sm">
                      <Label htmlFor="terms" className="font-medium text-slate-900 dark:text-white">
                        I agree to the terms and conditions
                      </Label>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        I understand that my registration is subject to approval by the event organizers 
                        and I agree to abide by the event rules and code of conduct.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications"
                        name="notifications"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                        title="Receive event notifications"
                        aria-label="Send me event updates and reminders"
                      />
                    </div>
                    <div className="text-sm">
                      <Label htmlFor="notifications" className="font-medium text-slate-900 dark:text-white">
                        Send me event updates and reminders
                      </Label>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        I would like to receive email notifications about event updates, schedule changes, and reminders.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" asChild className="flex-1">
                    <Link href={`/events/${eventId}`}>
                      Cancel
                    </Link>
                  </Button>
                  <Button type="submit" className="flex-1 gap-2" disabled={registering}>
                    <CheckCircle className="h-4 w-4" />
                    {registering ? "Registering..." : "Complete Registration"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}