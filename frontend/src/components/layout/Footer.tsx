import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <span className="font-display font-bold text-lg">AlumniConnect</span>
                <span className="block text-xs text-primary-foreground/70">University Portal</span>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm max-w-md">
              Connecting generations of alumni to foster networking, mentorship, and giving back to our alma mater. 
              Building bridges between past, present, and future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/alumni" className="hover:text-secondary transition-colors">Alumni Network</Link></li>
              <li><Link to="/jobs" className="hover:text-secondary transition-colors">Job Portal</Link></li>
              <li><Link to="/events" className="hover:text-secondary transition-colors">Events</Link></li>
              <li><Link to="/donate" className="hover:text-secondary transition-colors">Donate</Link></li>
              <li><Link to="/stories" className="hover:text-secondary transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>University Campus, City</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:alumni@university.edu" className="hover:text-secondary transition-colors">
                  alumni@university.edu
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 1234 567890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© 2025 AlumniConnect . All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
