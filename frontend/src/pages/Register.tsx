import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Mail, Lock, User, AlertCircle, Users, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'alumni' | 'student'>('alumni');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const result = await register(name, email, password, role);
    setIsLoading(false);

    if (result.success) {
      toast.success('Registration successful!');
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 py-12 px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-card rounded-2xl shadow-elevated p-8 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
            </Link>
            <h1 className="font-display text-2xl font-bold text-foreground">Join AlumniConnect</h1>
            <p className="text-muted-foreground text-sm mt-1">Create your account to get started</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('alumni')}
              className={cn(
                'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                role === 'alumni'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <Users className={cn('w-6 h-6 mb-2', role === 'alumni' ? 'text-primary' : 'text-muted-foreground')} />
              <div className={cn('font-semibold', role === 'alumni' ? 'text-primary' : 'text-foreground')}>Alumni</div>
              <div className="text-xs text-muted-foreground">Graduate of the university</div>
            </button>
            <button
              type="button"
              onClick={() => setRole('student')}
              className={cn(
                'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                role === 'student'
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:border-accent/50'
              )}
            >
              <BookOpen className={cn('w-6 h-6 mb-2', role === 'student' ? 'text-accent' : 'text-muted-foreground')} />
              <div className={cn('font-semibold', role === 'student' ? 'text-accent' : 'text-foreground')}>Student</div>
              <div className="text-xs text-muted-foreground">Currently enrolled</div>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className={cn(
                'w-full h-12 btn-glow',
                role === 'alumni' ? 'gradient-primary text-primary-foreground' : 'bg-accent text-accent-foreground hover:bg-accent/90'
              )}
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
