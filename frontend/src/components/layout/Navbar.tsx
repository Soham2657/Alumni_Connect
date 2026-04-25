import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GraduationCap, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = isAuthenticated ? (
    user?.role === 'admin' ? [
      { label: 'Dashboard', path: '/admin' },
      { label: 'Alumni', path: '/admin/alumni' },
      { label: 'Jobs', path: '/admin/jobs' },
      { label: 'Events', path: '/admin/events' },
      { label: 'Donations', path: '/admin/donations' },
    ] : [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Alumni Network', path: '/alumni' },
      { label: 'Jobs', path: '/jobs' },
      { label: 'Events', path: '/events' },
      { label: 'Success Stories', path: '/stories' },
      { label: 'Donate', path: '/donate' },
    ]
  ) : [
    { label: 'Home', path: '/' },
    { label: 'Success Stories', path: '/stories' },
    { label: 'Events', path: '/events' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-lg text-foreground">AlumniConnect</span>
              <span className="block text-xs text-muted-foreground -mt-1">University Portal</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full
                      ${user?.role === 'admin' ? 'role-badge-admin' : 
                        user?.role === 'alumni' ? 'role-badge-alumni' : 'role-badge-student'}`}>
                      {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  {user?.role === 'alumni' && (
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/login')} className="hidden sm:inline-flex">
                  Login
                </Button>
                <Button onClick={() => navigate('/register')} className="gradient-primary text-primary-foreground btn-glow">
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
