import { useState, useEffect } from 'react';
import { Event, EventRegistration } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar,
  Plus,
  MapPin,
  Clock,
  Users
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import { api } from '@/lib/api';

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'seminar' as Event['type'],
    maxAttendees: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const eventsResponse = await api.events.list();
        const storedEvents = eventsResponse.data as Event[];
        setEvents(storedEvents);

        const registrationsResponse = await Promise.all(
          storedEvents.map((event) => api.events.registrations(event.id).catch(() => ({ data: [] as EventRegistration[] })))
        );
        setRegistrations(registrationsResponse.flatMap((response) => response.data as EventRegistration[]));
      } catch {
        setEvents([]);
        setRegistrations([]);
      }
    };

    void load();
  }, []);

  const getRegistrationCount = (eventId: string) => {
    return registrations.filter(r => r.eventId === eventId).length;
  };

  const handleCreateEvent = () => {
    void api.events.create({
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      type: newEvent.type,
      maxAttendees: newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : undefined,
    }).then((response) => {
      const event = response.data as Event;
      setEvents((current) => [...current, event]);
      toast.success('Event created successfully!');
      setIsDialogOpen(false);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'seminar',
        maxAttendees: '',
      });
    }).catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create event');
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Events Management
          </h1>
          <p className="text-muted-foreground">{events.length} total events</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Event Title</Label>
                <Input
                  placeholder="e.g., Annual Alumni Reunion"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    placeholder="e.g., 10:00 AM"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="e.g., University Main Campus"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event['type'] })}
                    className="input-styled"
                  >
                    <option value="reunion">Reunion</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="networking">Networking</option>
                    <option value="cultural">Cultural</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Max Attendees (optional)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 100"
                    value={newEvent.maxAttendees}
                    onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the event..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
                />
              </div>
              <Button
                onClick={handleCreateEvent}
                className="w-full gradient-primary text-primary-foreground"
                disabled={!newEvent.title || !newEvent.date || !newEvent.location}
              >
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Registrations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString('en-IN')}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full capitalize">
                    {event.type}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {getRegistrationCount(event.id)}
                    {event.maxAttendees && ` / ${event.maxAttendees}`}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No events created yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
