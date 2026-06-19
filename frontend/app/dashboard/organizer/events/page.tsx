'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus,
  Edit,
  Eye,
  Users,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useState } from "react";

export default function MyEvents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const events = [
    { 
      id: 1, 
      title: "Tech Workshop: AI Fundamentals", 
      date: "2024-03-20", 
      time: "2:00 PM - 5:00 PM",
      location: "FAST-NU Main Hall",
      registrations: 45,
      capacity: 50,
      status: "published",
      category: "Workshop",
      revenue: "₨ 4,500"
    },
    { 
      id: 2, 
      title: "Networking Mixer", 
      date: "2024-03-25", 
      time: "6:00 PM - 9:00 PM",
      location: "LUMS Courtyard",
      registrations: 23,
      capacity: 100,
      status: "published",
      category: "Networking",
      revenue: "₨ 2,300"
    },
    { 
      id: 3, 
      title: "Career Development Seminar", 
      date: "2024-04-05", 
      time: "10:00 AM - 1:00 PM",
      location: "IBA Auditorium",
      registrations: 67,
      capacity: 80,
      status: "published",
      category: "Seminar",
      revenue: "₨ 6,700"
    },
    { 
      id: 4, 
      title: "Blockchain Conference", 
      date: "2024-04-15", 
      time: "9:00 AM - 5:00 PM",
      location: "NUST Conference Center",
      registrations: 0,
      capacity: 200,
      status: "draft",
      category: "Conference",
      revenue: "₨ 0"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'draft': return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Events</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Manage and track all your created events
          </p>
        </div>
        <Button className="gap-2" asChild>
          <a href="/dashboard/organizer/create-event">
            <Plus className="h-4 w-4" />
            Create Event
          </a>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Events</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Published</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Drafts</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold">₨ 13,500</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {event.date} • {event.time}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{event.registrations}/{event.capacity} registered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Revenue: {event.revenue}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                ></div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" asChild>
                  <a href={`/dashboard/organizer/events/${event.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </a>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`/dashboard/organizer/events/${event.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </a>
                </Button>
                <Button size="sm" variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}