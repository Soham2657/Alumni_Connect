import { useState, useEffect } from 'react';
import { Job, JobApplication } from '@/utils/mockData';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  MapPin, 
  Building, 
  Clock, 
  Briefcase,
  Plus,
  DollarSign,
  CheckCircle
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

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [alumniProfiles, setAlumniProfiles] = useState<{ userId?: string; name?: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    type: 'Full-time' as Job['type'],
    salary: '',
    requirements: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [jobsResponse, applicationsResponse] = await Promise.all([
          api.jobs.list(),
          api.applications.mine(),
        ]);

        const alumniResponse = await api.alumni.list();

        const activeJobs = (jobsResponse.data as Job[]).filter((job) => job.isActive);
        setJobs(activeJobs);
        setFilteredJobs(activeJobs);
        setApplications(applicationsResponse.data as JobApplication[]);
        setAlumniProfiles(alumniResponse.data as { userId?: string; name?: string }[]);
      } catch {
        setJobs([]);
        setFilteredJobs([]);
        setApplications([]);
        setAlumniProfiles([]);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(query) ||
          j.company.toLowerCase().includes(query) ||
          j.location.toLowerCase().includes(query)
      );
    }

    if (selectedType) {
      filtered = filtered.filter(j => j.type === selectedType);
    }

    setFilteredJobs(filtered);
  }, [searchQuery, selectedType, jobs]);

  const hasApplied = (jobId: string) => {
    return applications.some(a => a.jobId === jobId && a.userId === user?.id);
  };

  const handleApply = (job: Job) => {
    if (!user) return;

    void api.jobs.apply(job.id).then((response) => {
      setApplications((current) => [...current, response.data as JobApplication]);
      toast.success(`Applied to ${job.title} at ${job.company}!`);
    }).catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Application failed');
    });
  };

  const handlePostJob = () => {
    if (!user) return;
    void api.jobs.create({
      title: newJob.title,
      company: newJob.company,
      description: newJob.description,
      location: newJob.location,
      type: newJob.type,
      salary: newJob.salary,
      requirements: newJob.requirements.split(',').map((r) => r.trim()).filter(Boolean),
    }).then((response) => {
      const created = response.data as Job;
      setJobs((current) => [created, ...current]);
      setFilteredJobs((current) => [created, ...current]);
      toast.success('Job posted successfully!');
      setIsPostDialogOpen(false);
      setNewJob({
        title: '',
        company: '',
        description: '',
        location: '',
        type: 'Full-time',
        salary: '',
        requirements: '',
      });
    }).catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to post job');
    });
  };

  const getPostedBy = (userId: string) => {
    const profile = alumniProfiles.find((p) => p.userId === userId);
    return profile?.name || 'Unknown';
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Job Portal</h1>
          <p className="page-subtitle">Explore opportunities from alumni across industries</p>
        </div>
        
        {user?.role === 'alumni' && (
          <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground btn-glow">
                <Plus className="w-4 h-4 mr-2" />
                Post a Job
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card max-w-lg">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
                <DialogDescription>
                  Share job opportunities with students and fellow alumni.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    placeholder="e.g., Software Engineer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    placeholder="e.g., Google"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="e.g., Bangalore"
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Type</Label>
                    <select
                      value={newJob.type}
                      onChange={(e) => setNewJob({ ...newJob, type: e.target.value as Job['type'] })}
                      className="input-styled"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Salary (optional)</Label>
                  <Input
                    placeholder="e.g., ₹10-15 LPA"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the role, responsibilities, and ideal candidate..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Requirements (comma-separated)</Label>
                  <Input
                    placeholder="e.g., 2+ years experience, Python, SQL"
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  />
                </div>
                <Button 
                  onClick={handlePostJob}
                  className="w-full gradient-primary text-primary-foreground"
                  disabled={!newJob.title || !newJob.company || !newJob.description || !newJob.location}
                >
                  Post Job
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-card rounded-xl p-6 mb-8 shadow-card border border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="input-styled min-w-[150px]"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-card rounded-xl p-6 shadow-card border border-border card-hover"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 gradient-primary rounded-lg flex items-center justify-center">
                    <Building className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">{job.title}</h3>
                    <p className="text-muted-foreground">{job.company}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Posted {new Date(job.postedAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mt-4 line-clamp-2">{job.description}</p>

                {job.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.requirements.slice(0, 4).map((req, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-4">
                  Posted by: {getPostedBy(job.postedBy)}
                </p>
              </div>

              <div className="flex lg:flex-col gap-2">
                {hasApplied(job.id) ? (
                  <Button disabled className="gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Applied
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleApply(job)}
                    className="gradient-primary text-primary-foreground btn-glow"
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-16 bg-card rounded-xl">
          <Briefcase className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
          <p className="text-muted-foreground">Check back later for new opportunities</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;
