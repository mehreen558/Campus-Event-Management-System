'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Image,
  Tag,
  Upload
} from "lucide-react";
import { useState } from "react";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    capacity: "",
    price: "",
    category: "",
    tags: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const categories = [
    "Technology",
    "Business",
    "Cultural",
    "Sports",
    "Workshop",
    "Conference",
    "Networking",
    "Seminar",
    "Career Fair",
    "Hackathon"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Event</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Fill in the details to create your event
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential details about your event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Event Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event in detail..."
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    placeholder="Maximum attendees"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle>Date & Time</CardTitle>
              <CardDescription>
                When and where your event will take place
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      className="pl-10"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Start Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      className="pl-10"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      className="pl-10"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="location"
                    name="location"
                    placeholder="Event venue address"
                    className="pl-10"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>
                Set ticket prices for your event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="price">Ticket Price (PKR) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0 for free event"
                    className="pl-10"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enter 0 for free events
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Image */}
          <Card>
            <CardHeader>
              <CardTitle>Event Image</CardTitle>
              <CardDescription>
                Upload a cover image for your event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                <Image className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Drag and drop an image, or click to browse
                </p>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Image
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add tags to help people find your event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="tags">Event Tags</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="tech, workshop, ai (comma separated)"
                    className="pl-10"
                    value={formData.tags}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publish Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Event</CardTitle>
              <CardDescription>
                Save and publish your event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full gap-2">
                <Calendar className="h-4 w-4" />
                Publish Event
              </Button>
              <Button variant="outline" className="w-full">
                Save Draft
              </Button>
              <Button variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50">
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}