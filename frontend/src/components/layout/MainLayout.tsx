import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import StudentSidebar from './StudentSidebar';
import { useAuth } from '@/context/AuthContext';

const MainLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  // Show sidebar for authenticated non-admin users on these routes
  const showSidebar = isAuthenticated && 
    user?.role !== 'admin' && 
    (location.pathname.startsWith('/dashboard') || 
     location.pathname.startsWith('/alumni') || 
     location.pathname.startsWith('/jobs') || 
     location.pathname.startsWith('/events') || 
     location.pathname.startsWith('/stories') || 
     location.pathname.startsWith('/donate') ||
     location.pathname.startsWith('/mentorship') ||
     location.pathname.startsWith('/profile'));

  if (showSidebar) {
    return (
      <div className="flex min-h-screen bg-background">
        <StudentSidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
