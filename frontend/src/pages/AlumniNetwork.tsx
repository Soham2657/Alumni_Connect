import { useState, useEffect } from 'react';
import { AlumniProfile, MentorshipRequest, generateId } from '@/utils/mockData';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Building, 
  GraduationCap, 
  Filter,
  Linkedin,
  Mail,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';

const AlumniNetwork = () => {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<AlumniProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [mentorshipMessage, setMentorshipMessage] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<AlumniProfile | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.alumni.list();
        const storedAlumni = response.data as AlumniProfile[];
        setAlumni(storedAlumni);
        setFilteredAlumni(storedAlumni);
      } catch {
        setAlumni([]);
        setFilteredAlumni([]);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    let filtered = alumni;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.currentCompany.toLowerCase().includes(query) ||
          a.skills.some(s => s.toLowerCase().includes(query))
      );
    }

    if (selectedBranch) {
      filtered = filtered.filter(a => a.branch === selectedBranch);
    }

    if (selectedYear) {
      filtered = filtered.filter(a => a.graduationYear.toString() === selectedYear);
    }

    if (selectedIndustry) {
      filtered = filtered.filter(a => a.industry === selectedIndustry);
    }

    setFilteredAlumni(filtered);
  }, [searchQuery, selectedBranch, selectedYear, selectedIndustry, alumni]);

  const branches = [...new Set(alumni.map(a => a.branch))];
  const years = [...new Set(alumni.map(a => a.graduationYear.toString()))].sort().reverse();
  const industries = [...new Set(alumni.map(a => a.industry))];

  const handleMentorshipRequest = (mentor: AlumniProfile) => {
    if (!user) return;

    void api.mentorship.create({
      mentorId: mentor.userId,
      menteeId: user.id,
      menteeName: user.name,
      message: mentorshipMessage,
      status: 'pending',
    }).then(() => {
      toast.success(`Mentorship request sent to ${mentor.name}!`);
      setSelectedMentor(null);
      setMentorshipMessage('');
    }).catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to send mentorship request');
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBranch('');
    setSelectedYear('');
    setSelectedIndustry('');
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Alumni Network</h1>
        <p className="page-subtitle">Connect with {alumni.length} alumni from our university</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-card rounded-xl p-6 mb-8 shadow-card border border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="input-styled min-w-[150px]"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="input-styled min-w-[150px]"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="input-styled min-w-[150px]"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            {(selectedBranch || selectedYear || selectedIndustry) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Showing {filteredAlumni.length} of {alumni.length} alumni
        </p>
      </div>

      {/* Alumni Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((alumnus) => (
          <div
            key={alumnus.userId}
            className="bg-card rounded-xl p-6 shadow-card border border-border card-hover"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {alumnus.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-foreground truncate">{alumnus.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{alumnus.role}</p>
                <div className="flex items-center gap-1 text-sm text-accent mt-1">
                  <Building className="w-4 h-4" />
                  <span className="truncate">{alumnus.currentCompany}</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                <span>{alumnus.branch} • Class of {alumnus.graduationYear}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{alumnus.location}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {alumnus.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {alumnus.skills.length > 3 && (
                <span className="px-2 py-1 text-xs text-muted-foreground">
                  +{alumnus.skills.length - 3} more
                </span>
              )}
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {alumnus.bio}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              {alumnus.linkedin && (
                <Button variant="outline" size="sm" asChild>
                  <a href={alumnus.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4 mr-1" />
                    LinkedIn
                  </a>
                </Button>
              )}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="gradient-primary text-primary-foreground btn-glow"
                    onClick={() => setSelectedMentor(alumnus)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Request Mentorship
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogHeader>
                    <DialogTitle>Request Mentorship from {alumnus.name}</DialogTitle>
                    <DialogDescription>
                      Send a message introducing yourself and explaining why you'd like mentorship.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Textarea
                      placeholder="Hi, I'm a student interested in your field. I would love to learn from your experience..."
                      value={mentorshipMessage}
                      onChange={(e) => setMentorshipMessage(e.target.value)}
                      rows={4}
                    />
                    <Button 
                      onClick={() => handleMentorshipRequest(alumnus)}
                      className="w-full gradient-primary text-primary-foreground"
                      disabled={!mentorshipMessage.trim()}
                    >
                      Send Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>

      {filteredAlumni.length === 0 && (
        <div className="text-center py-16">
          <Filter className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No alumni found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
          <Button variant="outline" onClick={clearFilters} className="mt-4">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlumniNetwork;
