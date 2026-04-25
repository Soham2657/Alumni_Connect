import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AlumniProfile, MentorshipRequest } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Users, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

const Mentorship = () => {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<AlumniProfile | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [alumniResponse, mentorshipResponse] = await Promise.all([
          api.alumni.list(),
          api.mentorship.list(),
        ]);

        setAlumni(alumniResponse.data as AlumniProfile[]);
        setMentorshipRequests(mentorshipResponse.data as MentorshipRequest[]);
      } catch {
        setAlumni([]);
        setMentorshipRequests([]);
      }
    };

    void load();
  }, []);

  const filteredAlumni = alumni.filter(alum => 
    alum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alum.currentCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alum.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alum.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myRequests = mentorshipRequests.filter(req => 
    req.menteeId === user?.id
  );

  const handleSendRequest = () => {
    if (!selectedMentor || !requestMessage.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a message for your mentorship request.',
        variant: 'destructive',
      });
      return;
    }

    void api.mentorship.create({
      mentorId: selectedMentor.userId,
      menteeId: user?.id || '',
      menteeName: user?.name || '',
      message: requestMessage,
      status: 'pending',
    }).then((response) => {
      setMentorshipRequests((current) => [...current, response.data as MentorshipRequest]);

      toast({
        title: 'Request Sent!',
        description: `Your mentorship request has been sent to ${selectedMentor.name}.`,
      });

      setRequestMessage('');
      setSelectedMentor(null);
      setIsDialogOpen(false);
    }).catch((error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send mentorship request',
        variant: 'destructive',
      });
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      pending: 'secondary',
      accepted: 'default',
      rejected: 'destructive',
    };
    return variants[status] || 'outline';
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Mentorship Program
        </h1>
        <p className="text-muted-foreground">
          Connect with experienced alumni mentors to guide your career journey.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{alumni.length}</div>
              <div className="text-sm text-muted-foreground">Available Mentors</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{myRequests.length}</div>
              <div className="text-sm text-muted-foreground">My Requests</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {myRequests.filter(r => r.status === 'accepted').length}
              </div>
              <div className="text-sm text-muted-foreground">Active Mentorships</div>
            </div>
          </div>
        </Card>
      </div>

      {/* My Requests Section */}
      {myRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">My Mentorship Requests</h2>
          <div className="space-y-3">
            {myRequests.map((request) => {
              const mentor = alumni.find(a => a.userId === request.mentorId);
              return (
                <Card key={request.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{mentor?.name}</h3>
                        <Badge variant={getStatusBadge(request.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {mentor?.role} at {mentor?.currentCompany}
                      </p>
                      <p className="text-sm text-foreground italic">"{request.message}"</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Sent on {new Date(request.requestedAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Find Mentors Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Find a Mentor</h2>
        
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, company, position, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alum) => {
            const hasExistingRequest = myRequests.some(
              req => req.mentorId === alum.userId && req.status === 'pending'
            );
            const isConnected = myRequests.some(
              req => req.mentorId === alum.userId && req.status === 'accepted'
            );

            return (
              <Card key={alum.userId} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-white">
                      {alum.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{alum.name}</h3>
                  <p className="text-sm text-muted-foreground">{alum.graduationYear}</p>
                </div>

                <div className="space-y-2 mb-4">
                  {alum.role && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{alum.role}</span>
                    </div>
                  )}
                  {alum.currentCompany && (
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{alum.currentCompany}</span>
                    </div>
                  )}
                </div>

                {isConnected ? (
                  <Button className="w-full" variant="outline" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Connected
                  </Button>
                ) : hasExistingRequest ? (
                  <Button className="w-full" variant="outline" disabled>
                    <Clock className="w-4 h-4 mr-2" />
                    Request Pending
                  </Button>
                ) : (
                  <Dialog open={isDialogOpen && selectedMentor?.userId === alum.userId} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                      setSelectedMentor(null);
                      setRequestMessage('');
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full gradient-primary text-primary-foreground"
                        onClick={() => setSelectedMentor(alum)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Request Mentorship
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Mentorship from {alum.name}</DialogTitle>
                        <DialogDescription>
                          Send a personalized message explaining why you'd like {alum.name} as your mentor.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Textarea
                          placeholder="Hi, I'm interested in learning more about your experience in..."
                          value={requestMessage}
                          onChange={(e) => setRequestMessage(e.target.value)}
                          rows={5}
                        />
                        <div className="flex gap-3">
                          <Button
                            onClick={handleSendRequest}
                            className="flex-1 gradient-primary text-primary-foreground"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Request
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsDialogOpen(false);
                              setSelectedMentor(null);
                              setRequestMessage('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </Card>
            );
          })}
        </div>

        {filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No mentors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentorship;
