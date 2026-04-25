import { useState, useEffect } from 'react';
import { AlumniProfile } from '@/utils/mockData';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Users,
  MapPin,
  Building,
  GraduationCap
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from '@/lib/api';

const AdminAlumni = () => {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<AlumniProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    void api.alumni.list().then((response) => {
      const storedAlumni = response.data as AlumniProfile[];
      setAlumni(storedAlumni);
      setFilteredAlumni(storedAlumni);
    }).catch(() => {
      setAlumni([]);
      setFilteredAlumni([]);
    });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredAlumni(
        alumni.filter(
          (a) =>
            a.name.toLowerCase().includes(query) ||
            a.email.toLowerCase().includes(query) ||
            a.currentCompany.toLowerCase().includes(query) ||
            a.branch.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredAlumni(alumni);
    }
  }, [searchQuery, alumni]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6" />
            Alumni Management
          </h1>
          <p className="text-muted-foreground">{alumni.length} registered alumni</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search alumni..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alumni</TableHead>
              <TableHead>Branch & Year</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Industry</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlumni.map((alumnus) => (
              <TableRow key={alumnus.userId}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                      {alumnus.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{alumnus.name}</p>
                      <p className="text-sm text-muted-foreground">{alumnus.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    <span>{alumnus.branch}</span>
                    <span>•</span>
                    <span>{alumnus.graduationYear}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>{alumnus.currentCompany || '-'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{alumnus.location || '-'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                    {alumnus.industry || 'Not specified'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No alumni found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAlumni;
