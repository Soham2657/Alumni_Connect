import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { AlumniProfile, Job, Event } from '@/utils/mockData';
import { api } from '@/lib/api';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Clock,
  MapPin,
  Building
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    alumni: 0,
    jobs: 0,
    events: 0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [alumniResponse, jobsResponse, eventsResponse] = await Promise.all([
          api.alumni.list(),
          api.jobs.list(),
          api.events.list(),
        ]);

        const alumni = alumniResponse.data as AlumniProfile[];
        const jobs = jobsResponse.data as Job[];
        const events = eventsResponse.data as Event[];

        setStats({
          alumni: alumni.length,
          jobs: jobs.filter((job) => job.isActive).length,
          events: events.length,
        });

        setRecentJobs(jobs.filter((job) => job.isActive).slice(0, 3));
        setUpcomingEvents(events.slice(0, 3));
      } catch {
        setStats({ alumni: 0, jobs: 0, events: 0 });
        setRecentJobs([]);
        setUpcomingEvents([]);
      }
    };

    void load();
  }, [user]);

  const statCards = [
    { icon: Users, label: 'Alumni Network', value: stats.alumni, color: 'bg-primary', link: '/alumni' },
    { icon: Briefcase, label: 'Active Jobs', value: stats.jobs, color: 'bg-accent', link: '/jobs' },
    { icon: Calendar, label: 'Upcoming Events', value: stats.events, color: 'bg-secondary', link: '/events' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          {user?.role === 'alumni' 
            ? 'Connect with fellow alumni and explore opportunities.' 
            : 'Explore mentorship opportunities and job postings from alumni.'}
        </p>
      </div>

      {/* Quick Actions for Alumni */}
      {user?.role === 'alumni' && (
        <div className="mb-8 p-6 gradient-primary rounded-2xl text-primary-foreground">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Complete Your Profile</h2>
              <p className="text-primary-foreground/80 text-sm">
                Help students and fellow alumni connect with you by completing your profile.
              </p>
            </div>
            <Button asChild className="gradient-gold text-secondary-foreground btn-glow">
              <Link to="/profile">
                Update Profile <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="stat-card group"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-foreground">Recent Job Postings</h2>
            <Link to="/jobs" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {recentJobs.length > 0 ? (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <h3 className="font-medium text-foreground">{job.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                  </div>
                  <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                    {job.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No job postings yet</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-foreground">Upcoming Events</h2>
            <Link to="/events" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <h3 className="font-medium text-foreground">{event.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                  </div>
                  <span className="inline-block mt-2 px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded capitalize">
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No upcoming events</p>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/alumni"
          className="p-4 bg-card rounded-xl border border-border hover:shadow-card transition-all text-center group"
        >
          <Users className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-medium text-foreground">Browse Alumni</span>
        </Link>
        <Link
          to="/donate"
          className="p-4 bg-card rounded-xl border border-border hover:shadow-card transition-all text-center group"
        >
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-secondary group-hover:scale-110 transition-transform" />
          <span className="font-medium text-foreground">Make a Donation</span>
        </Link>
        <Link
          to="/stories"
          className="p-4 bg-card rounded-xl border border-border hover:shadow-card transition-all text-center group"
        >
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-accent group-hover:scale-110 transition-transform" />
          <span className="font-medium text-foreground">Success Stories</span>
        </Link>
        <Link
          to="/events"
          className="p-4 bg-card rounded-xl border border-border hover:shadow-card transition-all text-center group"
        >
          <Calendar className="w-8 h-8 mx-auto mb-2 text-info group-hover:scale-110 transition-transform" />
          <span className="font-medium text-foreground">View Events</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
