import { useState, useEffect } from 'react';
import { SuccessStory } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Star,
  Plus,
  GraduationCap,
  Edit,
  Trash2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { api } from '@/lib/api';

const AdminStories = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStory, setNewStory] = useState({
    alumniName: '',
    graduationYear: new Date().getFullYear() - 5,
    branch: '',
    title: '',
    story: '',
    achievement: '',
    featured: false,
  });

  useEffect(() => {
    void api.stories.list().then((response) => {
      setStories(response.data as SuccessStory[]);
    }).catch(() => {
      setStories([]);
    });
  }, []);

  const handleCreateStory = () => {
    void api.stories.create({
      alumniName: newStory.alumniName,
      graduationYear: newStory.graduationYear,
      branch: newStory.branch,
      title: newStory.title,
      story: newStory.story,
      achievement: newStory.achievement,
      featured: newStory.featured,
    }).then((response) => {
      const story = response.data as SuccessStory;
      setStories((current) => [...current, story]);
      toast.success('Success story added!');
      setIsDialogOpen(false);
      setNewStory({
        alumniName: '',
        graduationYear: new Date().getFullYear() - 5,
        branch: '',
        title: '',
        story: '',
        achievement: '',
        featured: false,
      });
    }).catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add story');
    });
  };

  const toggleFeatured = (storyId: string) => {
    const target = stories.find((story) => story.id === storyId);
    if (!target) return;

    void api.stories.update(storyId, { featured: !target.featured }).then((response) => {
      const updated = response.data as SuccessStory;
      setStories((current) => current.map((story) => (story.id === storyId ? updated : story)));
      toast.success('Story updated');
    }).catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update story');
    });
  };

  const deleteStory = (storyId: string) => {
    void api.stories.remove(storyId).then(() => {
      setStories((current) => current.filter((story) => story.id !== storyId));
      toast.success('Story deleted');
    }).catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete story');
    });
  };

  const branches = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Chemical',
    'Biotechnology',
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Star className="w-6 h-6" />
            Success Stories
          </h1>
          <p className="text-muted-foreground">{stories.length} stories published</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-gold text-secondary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Story
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Success Story</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Alumni Name</Label>
                  <Input
                    placeholder="e.g., John Doe"
                    value={newStory.alumniName}
                    onChange={(e) => setNewStory({ ...newStory, alumniName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Graduation Year</Label>
                  <Input
                    type="number"
                    value={newStory.graduationYear}
                    onChange={(e) => setNewStory({ ...newStory, graduationYear: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <select
                  value={newStory.branch}
                  onChange={(e) => setNewStory({ ...newStory, branch: e.target.value })}
                  className="input-styled"
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Story Title</Label>
                <Input
                  placeholder="e.g., From Campus to Silicon Valley"
                  value={newStory.title}
                  onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Story</Label>
                <Textarea
                  placeholder="Tell their journey..."
                  value={newStory.story}
                  onChange={(e) => setNewStory({ ...newStory, story: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Key Achievement</Label>
                <Input
                  placeholder="e.g., Founded a successful startup"
                  value={newStory.achievement}
                  onChange={(e) => setNewStory({ ...newStory, achievement: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Feature this story</Label>
                <Switch
                  checked={newStory.featured}
                  onCheckedChange={(checked) => setNewStory({ ...newStory, featured: checked })}
                />
              </div>
              <Button
                onClick={handleCreateStory}
                className="w-full gradient-primary text-primary-foreground"
                disabled={!newStory.alumniName || !newStory.title || !newStory.story}
              >
                Add Story
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div key={story.id} className="bg-card rounded-xl p-6 shadow-card border border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-lg font-bold text-primary-foreground">
                  {story.alumniName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{story.alumniName}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    {story.branch} • {story.graduationYear}
                  </p>
                </div>
              </div>
              {story.featured && (
                <Star className="w-5 h-5 text-secondary fill-secondary" />
              )}
            </div>

            <h3 className="font-semibold text-foreground mb-2">{story.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{story.story}</p>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={story.featured}
                  onCheckedChange={() => toggleFeatured(story.id)}
                />
                <span className="text-xs text-muted-foreground">Featured</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteStory(story.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {stories.length === 0 && (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Star className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No success stories added yet</p>
        </div>
      )}
    </div>
  );
};

export default AdminStories;
