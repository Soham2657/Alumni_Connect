import { useState, useEffect } from 'react';
import { Donation } from '@/utils/mockData';
import { 
  Gift,
  IndianRupee,
  TrendingUp
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

const AdminDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    scholarship: 0,
    infrastructure: 0,
    research: 0,
    general: 0,
  });

  useEffect(() => {
    void api.donations.list().then((response) => {
      const storedDonations = (response.data as Donation[]).sort((a, b) => new Date(b.donatedAt).getTime() - new Date(a.donatedAt).getTime());
      setDonations(storedDonations);

      const total = storedDonations.reduce((sum, d) => sum + d.amount, 0);
      const scholarship = storedDonations.filter(d => d.purpose === 'scholarship').reduce((sum, d) => sum + d.amount, 0);
      const infrastructure = storedDonations.filter(d => d.purpose === 'infrastructure').reduce((sum, d) => sum + d.amount, 0);
      const research = storedDonations.filter(d => d.purpose === 'research').reduce((sum, d) => sum + d.amount, 0);
      const general = storedDonations.filter(d => d.purpose === 'general').reduce((sum, d) => sum + d.amount, 0);

      setStats({ total, scholarship, infrastructure, research, general });
    }).catch(() => {
      setDonations([]);
      setStats({ total: 0, scholarship: 0, infrastructure: 0, research: 0, general: 0 });
    });
  }, []);

  const purposeColors: Record<string, string> = {
    scholarship: 'bg-primary text-primary-foreground',
    infrastructure: 'bg-accent text-accent-foreground',
    research: 'bg-info text-white',
    general: 'bg-secondary text-secondary-foreground',
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Gift className="w-6 h-6" />
          Donations
        </h1>
        <p className="text-muted-foreground">{donations.length} total donations received</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-secondary to-yellow-500 rounded-xl p-6 text-secondary-foreground">
          <TrendingUp className="w-6 h-6 mb-2" />
          <div className="text-2xl font-bold">₹{stats.total.toLocaleString('en-IN')}</div>
          <div className="text-sm opacity-80">Total Raised</div>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <div className="text-2xl font-bold text-foreground">₹{stats.scholarship.toLocaleString('en-IN')}</div>
          <div className="text-sm text-muted-foreground">Scholarships</div>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <div className="text-2xl font-bold text-foreground">₹{stats.infrastructure.toLocaleString('en-IN')}</div>
          <div className="text-sm text-muted-foreground">Infrastructure</div>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <div className="text-2xl font-bold text-foreground">₹{stats.research.toLocaleString('en-IN')}</div>
          <div className="text-sm text-muted-foreground">Research</div>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <div className="text-2xl font-bold text-foreground">₹{stats.general.toLocaleString('en-IN')}</div>
          <div className="text-sm text-muted-foreground">General Fund</div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Gift className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="font-medium text-foreground">{donation.userName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-semibold text-foreground">
                    <IndianRupee className="w-4 h-4" />
                    {donation.amount.toLocaleString('en-IN')}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full capitalize ${purposeColors[donation.purpose]}`}>
                    {donation.purpose}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm line-clamp-1">
                    {donation.message || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {new Date(donation.donatedAt).toLocaleDateString('en-IN')}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-muted-foreground">
                    {donation.transactionId}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {donations.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No donations received yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDonations;
