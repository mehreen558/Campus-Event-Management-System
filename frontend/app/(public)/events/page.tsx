'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Users, MapPin, Filter, Search, Heart, ArrowRight, Clock, Star, Sparkles, Building2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUniversity, setSelectedUniversity] = useState("All Universities");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    { id: "all", name: "All Events", icon: Sparkles, color: "from-blue-500 to-cyan-500" },
    { id: "tech", name: "Tech & Hackathons", icon: Star, color: "from-purple-500 to-pink-500" },
    { id: "business", name: "Business", icon: Building2, color: "from-green-500 to-emerald-500" },
    { id: "cultural", name: "Cultural", icon: Users, color: "from-orange-500 to-red-500" },
    { id: "career", name: "Career Fairs", icon: Calendar, color: "from-indigo-500 to-purple-500" },
    { id: "sports", name: "Sports", icon: Sparkles, color: "from-cyan-500 to-blue-500" }
  ];

  const universities = [
    "All Universities", 
    "FAST-NU", 
    "LUMS", 
    "IBA", 
    "NUST", 
    "Habib University", 
    "KU",
    "NED University",
    "COMSATS",
    "GIKI",
    "IVS",
    "IoBM",
    "SZABIST",
    "UET Lahore",
    "PUCIT"
  ];

  const events = [
    {
      id: 1,
      title: "Inter-University Hackathon 2024",
      description: "Annual coding competition with participants from all partner universities. Build innovative solutions for real-world problems.",
      date: "Dec 15, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "FAST-NU, Karachi Campus",
      university: "FAST-NU",
      category: "tech",
      attendees: 200,
      image: "/api/placeholder/400/250",
      price: "Free",
      registrationDeadline: "Dec 10, 2024",
      organizer: "FAST-NU Computer Science Department"
    },
    {
      id: 2,
      title: "LUMS Business Summit",
      description: "Leading business conference featuring industry experts, networking sessions, and case competitions.",
      date: "Dec 20, 2024",
      time: "10:00 AM - 5:00 PM",
      location: "LUMS, Lahore",
      university: "LUMS",
      category: "business",
      attendees: 300,
      image: "/api/placeholder/400/250",
      price: "₨ 500",
      registrationDeadline: "Dec 15, 2024",
      organizer: "LUMS Business School"
    },
    {
      id: 3,
      title: "IBA Career Expo 2025",
      description: "Connect with top employers and explore career opportunities across various industries.",
      date: "Jan 10, 2025",
      time: "11:00 AM - 4:00 PM",
      location: "IBA, Karachi",
      university: "IBA",
      category: "career",
      attendees: 500,
      image: "/api/placeholder/400/250",
      price: "Free",
      registrationDeadline: "Jan 5, 2025",
      organizer: "IBA Career Services"
    },
    {
      id: 4,
      title: "NUST Engineering Symposium",
      description: "Showcase of engineering projects, technical workshops, and innovation challenges.",
      date: "Jan 25, 2025",
      time: "9:30 AM - 5:30 PM",
      location: "NUST, Islamabad",
      university: "NUST",
      category: "tech",
      attendees: 150,
      image: "/api/placeholder/400/250",
      price: "₨ 300",
      registrationDeadline: "Jan 20, 2025",
      organizer: "NUST Engineering Department"
    },
    {
      id: 5,
      title: "Habib Cultural Festival",
      description: "Celebration of arts, music, and cultural diversity with performances and workshops.",
      date: "Feb 5, 2025",
      time: "2:00 PM - 10:00 PM",
      location: "Habib University, Karachi",
      university: "Habib University",
      category: "cultural",
      attendees: 400,
      image: "/api/placeholder/400/250",
      price: "₨ 200",
      registrationDeadline: "Feb 1, 2025",
      organizer: "HU Arts Society"
    },
    {
      id: 6,
      title: "KU Research Conference",
      description: "Annual research presentation and academic discussion forum for students and faculty.",
      date: "Feb 15, 2025",
      time: "9:00 AM - 4:00 PM",
      location: "KU, Karachi",
      university: "KU",
      category: "career",
      attendees: 250,
      image: "/api/placeholder/400/250",
      price: "Free",
      registrationDeadline: "Feb 10, 2025",
      organizer: "KU Research Office"
    },
    {
      id: 7,
      title: "NED Tech Innovation Expo",
      description: "Showcasing cutting-edge technology projects and innovations from engineering students.",
      date: "Mar 10, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "NED University, Karachi",
      university: "NED University",
      category: "tech",
      attendees: 180,
      image: "/api/placeholder/400/250",
      price: "Free",
      registrationDeadline: "Mar 5, 2025",
      organizer: "NED Engineering Department"
    },
    {
      id: 8,
      title: "COMSATS AI Summit",
      description: "Exploring the future of artificial intelligence with workshops and expert talks.",
      date: "Mar 20, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "COMSATS, Islamabad",
      university: "COMSATS",
      category: "tech",
      attendees: 120,
      image: "/api/placeholder/400/250",
      price: "₨ 400",
      registrationDeadline: "Mar 15, 2025",
      organizer: "COMSATS Computer Science Department"
    },
    {
      id: 9,
      title: "GIKI Science Fair",
      description: "Annual science and engineering exhibition featuring innovative student projects.",
      date: "Apr 5, 2025",
      time: "11:00 AM - 3:00 PM",
      location: "GIKI, Topi",
      university: "GIKI",
      category: "tech",
      attendees: 90,
      image: "/api/placeholder/400/250",
      price: "Free",
      registrationDeadline: "Mar 30, 2025",
      organizer: "GIKI Science Society"
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesUniversity = selectedUniversity === "All Universities" || event.university === selectedUniversity;
    
    return matchesSearch && matchesCategory && matchesUniversity;
  });

  const toggleFavorite = (eventId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
      } else {
        newFavorites.add(eventId);
      }
      return newFavorites;
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-600 via-purple-600 to-cyan-600 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Discover Amazing{" "}
              <span className="bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Events
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Explore inter-university events, connect with students across Pakistan, and create unforgettable experiences.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search events, topics, or universities..."
                  className="pl-12 pr-4 py-3 text-lg rounded-2xl border-0 shadow-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? `border-blue-500 bg-linear-to-r ${category.color} text-white shadow-lg`
                      : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-md"
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>

            {/* University Filter */}
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by university"
              >
                {universities.map((uni) => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Upcoming Events
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                {filteredEvents.length} events found across {universities.length - 1}+ universities
              </p>
            </div>
            
            <Button variant="outline" className="rounded-full border-2" asChild>
              <Link href="/events/create" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={() => { setSearchTerm(""); setSelectedCategory("all"); setSelectedUniversity("All Universities"); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700"
                >
                  {/* Event Image */}
                  <div className="h-48 bg-linear-to-br from-blue-500 to-cyan-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white text-xs px-3 py-1 rounded-full font-semibold backdrop-blur-sm">
                        {event.university}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => toggleFavorite(event.id)}
                        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-2 hover:scale-110 transition-transform duration-300"
                        type="button"
                        aria-label={favorites.has(event.id) ? "Remove from favorites" : "Add to favorites"}
                        title={favorites.has(event.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            favorites.has(event.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-slate-600'
                          }`} 
                        />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {event.price === "Free" ? "FREE" : event.price}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 flex-1 pr-4">
                        {event.title}
                      </h3>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span>{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span>{event.attendees} attendees</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <span>Register by {event.registrationDeadline}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300">
                        Register Now
                      </Button>
                      <Button variant="outline" className="shrink-0 border-2" asChild>
                        <Link href={`/events/${event.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Can&apos;t Find Your Event?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Create your own event and reach thousands of students across Pakistan&apos;s top universities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/events/create" className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Create Event
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 border-2" asChild>
                <Link href="/about" className="flex items-center gap-2">
                  Learn More
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}