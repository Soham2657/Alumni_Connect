import { useState, useEffect } from 'react';
import { Job, AlumniProfile } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { 
  Briefcase,
  MapPin,
  Building,
  CheckCircle,
  XCircle
} from 'lucide-react';
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

const AdminJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profiles, setProfiles] = useState<AlumniProfile[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [jobsResponse, alumniResponse] = await Promise.all([
          api.jobs.list(),
          api.alumni.list(),
        ]);
        setJobs(jobsResponse.data as Job[]);
        setProfiles(alumniResponse.data as AlumniProfile[]);
      } catch {
        setJobs([]);
        setProfiles([]);
      }
    };

    void load();
  }, []);

  const getPostedBy = (userId: string) => {
    const profile = profiles.find(p => p.userId === userId);
    return profile?.name || 'Unknown';
  };

  const toggleJobStatus = (jobId: string) => {
    const job = jobs.find((item) => item.id === jobId);
    if (!job) return;

    void api.jobs.update(jobId, { isActive: !job.isActive }).then((response) => {
      const updated = response.data as Job;
      setJobs((current) => current.map((item) => (item.id === jobId ? updated : item)));
      toast.success('Job status updated');
    }).catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update job');
    });
  };

  const activeJobs = jobs.filter(j => j.isActive);
  const inactiveJobs = jobs.filter(j => !j.isActive);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Job Postings
          </h1>
          <p className="text-muted-foreground">
            {activeJobs.length} active • {inactiveJobs.length} inactive
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Details</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Posted By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{job.title}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Building className="w-4 h-4" />
                    {job.company}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                    {job.type}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{getPostedBy(job.postedBy)}</span>
                </TableCell>
                <TableCell>
                  {job.isActive ? (
                    <span className="inline-flex items-center gap-1 text-success">
                      <CheckCircle className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <XCircle className="w-4 h-4" />
                      Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleJobStatus(job.id)}
                  >
                    {job.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No jobs posted yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobs;
