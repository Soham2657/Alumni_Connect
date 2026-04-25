import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  Gift, 
  BookOpen,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const StudentSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Alumni Network', path: '/alumni' },
    { icon: MessageSquare, label: 'Mentorship', path: '/mentorship' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: BookOpen, label: 'Success Stories', path: '/stories' },
    { icon: Gift, label: 'Donate', path: '/donate' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <span className="font-display font-bold text-sidebar-foreground">
              {user?.role === 'alumni' ? 'Alumni Portal' : 'Student Portal'}
            </span>
            <span className="block text-xs text-sidebar-foreground/60">AlumniConnect</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'nav-link',
                    isActive && 'active'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50 text-center">
          © {new Date().getFullYear()} AlumniConnect
        </p>
      </div>
    </aside>
  );
};

export default StudentSidebar;
