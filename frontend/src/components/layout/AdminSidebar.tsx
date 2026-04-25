import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  Gift, 
  BookOpen,
  Settings,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Alumni', path: '/admin/alumni' },
    { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: Gift, label: 'Donations', path: '/admin/donations' },
    { icon: BookOpen, label: 'Success Stories', path: '/admin/stories' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <span className="font-display font-bold text-sidebar-foreground">Admin Panel</span>
            <span className="block text-xs text-sidebar-foreground/60">AlumniConnect</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
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

export default AdminSidebar;
