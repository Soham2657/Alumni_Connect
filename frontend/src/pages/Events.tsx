import { useState, useEffect } from 'react';
import { Event, EventRegistration } from '@/utils/mockData';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [eventsResponse, registrationsResponse] = await Promise.all([
          api.events.list(),
          Promise.resolve({ data: [] as EventRegistration[] }),
        ]);

        const sortedEvents = (eventsResponse.data as Event[]).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setEvents(sortedEvents);
        setRegistrations(registrationsResponse.data);
      } catch {
        setEvents([]);
        setRegistrations([]);
      }
    };

    void load();
  }, []);

  const isRegistered = (eventId: string) => {
    return registrations.some(r => r.eventId === eventId && r.userId === user?.id);
  };

  const getRegistrationCount = (eventId: string) => {
    return registrations.filter(r => r.eventId === eventId).length;
  };

  const handleRegister = (event: Event) => {
    if (!user) {
      toast.error('Please login to register for events');
      return;
    }

    void api.events.register(event.id).then((response) => {
      setRegistrations((current) => [...current, response.data as EventRegistration]);
      toast.success(`Registered for ${event.title}!`);
    }).catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    });
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'reunion': return 'bg-secondary text-secondary-foreground';
      case 'workshop': return 'bg-accent text-accent-foreground';
      case 'seminar': return 'bg-primary text-primary-foreground';
      case 'networking': return 'bg-info text-white';
      case 'cultural': return 'bg-success text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
  const pastEvents = events.filter(e => new Date(e.date) < new Date());

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Events & Reunions</h1>
        <p className="page-subtitle">Stay connected with campus events and alumni gatherings</p>
      </div>

      {/* Upcoming Events */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Upcoming Events
        </h2>

        {upcomingEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-card rounded-xl overflow-hidden shadow-card border border-border card-hover"
              >
                {/* Event Image/Header */}
                <div className="h-32 gradient-primary relative flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-primary-foreground/30" />
                  <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full capitalize ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>
                        {getRegistrationCount(event.id)} registered
                        {event.maxAttendees && ` / ${event.maxAttendees} max`}
                      </span>
                    </div>
                  </div>

                  {isRegistered(event.id) ? (
                    <Button disabled className="w-full gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Registered
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleRegister(event)}
                      className="w-full gradient-primary text-primary-foreground btn-glow"
                      disabled={event.maxAttendees ? getRegistrationCount(event.id) >= event.maxAttendees : false}
                    >
                      Register Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming events</h3>
            <p className="text-muted-foreground">Check back later for new events</p>
          </div>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Past Events
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
            {pastEvents.slice(0, 6).map((event) => (
              <div
                key={event.id}
                className="bg-card rounded-xl overflow-hidden shadow-card border border-border"
              >
                <div className="h-24 bg-muted relative flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-muted-foreground/30" />
                  <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground capitalize">
                    {event.type}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Events;
