import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  GraduationCap, 
  Users, 
  Briefcase, 
  Calendar, 
  Gift, 
  ArrowRight,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Alumni Network',
      description: 'Connect with thousands of alumni across industries and locations.',
    },
    {
      icon: Briefcase,
      title: 'Job Portal',
      description: 'Exclusive job postings and internship opportunities from alumni.',
    },
    {
      icon: Calendar,
      title: 'Events & Reunions',
      description: 'Stay updated on campus events, workshops, and annual reunions.',
    },
    {
      icon: Gift,
      title: 'Give Back',
      description: 'Contribute to scholarships, infrastructure, and research initiatives.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Alumni' },
    { value: '500+', label: 'Companies Represented' },
    { value: '₹2Cr+', label: 'Donations Raised' },
    { value: '100+', label: 'Events Annually' },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero text-primary-foreground py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Connecting Alumni,<br />
              <span className="text-gradient">Building Futures</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              The official Alumni Association Platform for our university. Network with fellow alumni, 
              explore opportunities, and contribute to the legacy of our institution.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="gradient-gold text-secondary-foreground btn-glow text-lg px-8 h-14"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Join the Network'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/stories')}
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary h-14 px-8 font-medium"
              >
                View Success Stories
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background relative -mt-12 z-10">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-2xl p-8 shadow-elevated">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides comprehensive features to keep alumni connected and engaged with their alma mater.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 shadow-card card-hover border border-border"
              >
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="gradient-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
            <GraduationCap className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Connect?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Join thousands of alumni and students in building a stronger network. 
              Your journey with us doesn't end at graduation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="gradient-gold text-secondary-foreground btn-glow"
              >
                Register as Alumni
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary font-medium"
              >
                Register as Student
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Join AlumniConnect?
              </h2>
              <div className="space-y-4">
                {[
                  'Access exclusive job postings from top companies',
                  'Connect with mentors in your field',
                  'Stay updated on campus events and reunions',
                  'Contribute to scholarships and development',
                  'Build lasting professional relationships',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-foreground">Growing Network</h3>
                    <p className="text-muted-foreground">Join 10,000+ active members</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">85%</div>
                    <div className="text-xs text-muted-foreground">Placement Rate</div>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-accent">200+</div>
                    <div className="text-xs text-muted-foreground">Active Mentors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
