import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AlumniProfile } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Building, 
  MapPin, 
  Briefcase,
  Save,
  Plus,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AlumniProfile>({
    userId: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    graduationYear: new Date().getFullYear() - 5,
    branch: '',
    currentCompany: '',
    role: '',
    skills: [],
    location: '',
    bio: '',
    industry: '',
    linkedin: '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      void api.alumni.list().then((response) => {
        const profiles = response.data as AlumniProfile[];
        const existingProfile = profiles.find((p) => p.userId === user.id);

        if (existingProfile) {
          setProfile(existingProfile);
          return;
        }

        setProfile((prev) => ({
          ...prev,
          userId: user.id,
          name: user.name,
          email: user.email || '',
        }));
      }).catch(() => {
        setProfile((prev) => ({
          ...prev,
          userId: user.id,
          name: user.name,
          email: user.email || '',
        }));
      });
    }
  }, [user]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await api.alumni.upsertMe(profile);
      toast.success('Profile saved successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const branches = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Chemical',
    'Biotechnology',
    'Information Technology',
  ];

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Consulting',
    'E-commerce',
    'Manufacturing',
    'Education',
    'Government',
    'Startup',
    'Other',
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Keep your profile updated to help others connect with you</p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
            <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center text-4xl font-bold text-primary-foreground">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                Alumni
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={profile.graduationYear}
                  onChange={(e) => setProfile({ ...profile, graduationYear: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Branch</Label>
                <select
                  value={profile.branch}
                  onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                  className="input-styled"
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Industry</Label>
                <select
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  className="input-styled"
                >
                  <option value="">Select Industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Work Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">Current Company</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="e.g., Google"
                    value={profile.currentCompany}
                    onChange={(e) => setProfile({ ...profile, currentCompany: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="role"
                    placeholder="e.g., Software Engineer"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g., Bangalore, India"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Add a skill (e.g., Python, Leadership)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <Button type="button" onClick={handleAddSkill} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself, your journey, and what you're passionate about..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/yourprofile"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
              />
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-12 gradient-primary text-primary-foreground btn-glow"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
