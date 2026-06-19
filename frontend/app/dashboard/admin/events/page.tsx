'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye,
  MoreHorizontal
} from "lucide-react";
import { useState } from "react";

export default function EventManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const events = [
    { 
      id: 1, 
      title: "Tech Conference 2024", 
      organizer: "FAST Tech Club", 
      university: "FAST-NU", 
      date: "2024-03-15", 
      attendees: 150, 
      status: "approved",
      category: "Technology"
    },
    { 
      id: 2, 
      title: "Business Summit", 
      organizer: "LUMS Business Society", 
      university: "LUMS", 
      date: "2024-03-20", 
      attendees: 200, 
      status: "pending",
      category: "Business"
    },
    { 
      id: 3, 
      title: "Cultural Festival", 
      organizer: "Habib Arts Club", 
      university: "Habib University", 
      date: "2024-03-25", 
      attendees: 300, 
      status: "approved",
      category: "Cultural"
    },
    { 
      id: 4, 
      title: "Hackathon", 
      organizer: "NUST Computing", 
      university: "NUST", 
      date: "2024-04-01", 
      attendees: 100, 
      status: "rejected",
      category: "Technology"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Event Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Moderate and manage all events across universities
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Events</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Review</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Approved</p>
                <p className="text-2xl font-bold">128</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Rejected</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            Review and moderate event submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{event.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      by {event.organizer} • {event.university}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{event.category}</Badge>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {event.date} • {event.attendees} attendees
                  </span>
                  <div className="flex gap-2">
                    {event.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}