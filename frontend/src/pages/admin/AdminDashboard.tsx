import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlumniProfile, Job, Event, Donation } from '@/utils/mockData';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Gift,
  TrendingUp,
  ArrowUpRight,
  IndianRupee
} from 'lucide-react';
import { api } from '@/lib/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAlumni: 0,
    totalJobs: 0,
    totalEvents: 0,
    totalDonations: 0,
    donationAmount: 0,
  });
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [recentAlumni, setRecentAlumni] = useState<AlumniProfile[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [alumniResponse, jobsResponse, eventsResponse, donationsResponse] = await Promise.all([
          api.alumni.list(),
          api.jobs.list(),
          api.events.list(),
          api.donations.list(),
        ]);

        const alumni = alumniResponse.data as AlumniProfile[];
        const jobs = jobsResponse.data as Job[];
        const events = eventsResponse.data as Event[];
        const donations = donationsResponse.data as Donation[];

        setStats({
          totalAlumni: alumni.length,
          totalJobs: jobs.length,
          totalEvents: events.length,
          totalDonations: donations.length,
          donationAmount: donations.reduce((sum, d) => sum + d.amount, 0),
        });

        setRecentDonations(donations.slice(-5).reverse());
        setRecentAlumni(alumni.slice(-5).reverse());
      } catch {
        setStats({ totalAlumni: 0, totalJobs: 0, totalEvents: 0, totalDonations: 0, donationAmount: 0 });
        setRecentDonations([]);
        setRecentAlumni([]);
      }
    };

    void load();
  }, []);

  const statCards = [
    { 
      icon: Users, 
      label: 'Total Alumni', 
      value: stats.totalAlumni, 
      color: 'bg-primary',
      link: '/admin/alumni',
      change: '+12%' 
    },
    { 
      icon: Briefcase, 
      label: 'Job Postings', 
      value: stats.totalJobs, 
      color: 'bg-accent',
      link: '/admin/jobs',
      change: '+8%' 
    },
    { 
      icon: Calendar, 
      label: 'Events', 
      value: stats.totalEvents, 
      color: 'bg-info',
      link: '/admin/events',
      change: '+3' 
    },
    { 
      icon: Gift, 
      label: 'Donations', 
      value: stats.totalDonations, 
      color: 'bg-secondary',
      link: '/admin/donations',
      change: '+15%' 
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor and manage your alumni platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-elevated transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-success flex items-center gap-1">
                {stat.change}
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Total Donations Card */}
      <div className="bg-gradient-to-r from-secondary to-yellow-500 rounded-xl p-6 mb-8 text-secondary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-secondary-foreground/80 mb-1">Total Donations Collected</p>
            <div className="flex items-center gap-2">
              <IndianRupee className="w-8 h-8" />
              <span className="text-4xl font-bold">
                {stats.donationAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <TrendingUp className="w-16 h-16 text-secondary-foreground/30" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Alumni */}
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-foreground">Recent Alumni Registrations</h2>
            <Link to="/admin/alumni" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentAlumni.length > 0 ? (
              recentAlumni.map((alumnus) => (
                <div key={alumnus.userId} className="flex items-center gap-4">
                  <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {alumnus.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{alumnus.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {alumnus.branch} • {alumnus.graduationYear}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No alumni registered yet</p>
            )}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-foreground">Recent Donations</h2>
            <Link to="/admin/donations" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentDonations.length > 0 ? (
              recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Gift className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{donation.userName}</p>
                      <p className="text-sm text-muted-foreground capitalize">{donation.purpose}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-foreground">
                    ₹{donation.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No donations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
