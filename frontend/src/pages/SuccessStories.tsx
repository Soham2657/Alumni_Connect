import { useState, useEffect } from 'react';
import { SuccessStory } from '@/utils/mockData';
import { GraduationCap, Star, Quote } from 'lucide-react';
import { api } from '@/lib/api';

const SuccessStories = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);

  useEffect(() => {
    void api.stories.list().then((response) => {
      setStories(response.data as SuccessStory[]);
    }).catch(() => {
      setStories([]);
    });
  }, []);

  const featuredStories = stories.filter(s => s.featured);
  const otherStories = stories.filter(s => !s.featured);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="gradient-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <Star className="w-12 h-12 mx-auto mb-4 text-secondary" />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Success Stories</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Inspiring journeys of our alumni who have made their mark across industries
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-2">
              <Star className="w-6 h-6 text-secondary" />
              Featured Stories
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {featuredStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-elevated border border-border"
                >
                  {/* Header with gradient */}
                  <div className="h-40 gradient-hero relative flex items-end p-6">
                    <div className="absolute top-4 right-4 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                      Featured
                    </div>
                    <Quote className="absolute top-4 left-4 w-12 h-12 text-primary-foreground/20" />
                  </div>

                  {/* Content */}
                  <div className="p-6 relative">
                    {/* Avatar */}
                    <div className="absolute -top-12 left-6 w-20 h-20 gradient-primary rounded-full flex items-center justify-center text-3xl font-bold text-primary-foreground border-4 border-card">
                      {story.alumniName.charAt(0)}
                    </div>

                    <div className="mt-8">
                      <h3 className="font-display text-xl font-bold text-foreground mb-1">
                        {story.alumniName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {story.branch} • Class of {story.graduationYear}
                      </p>

                      <h4 className="font-semibold text-lg text-foreground mb-3">{story.title}</h4>
                      <p className="text-muted-foreground mb-4 line-clamp-4">{story.story}</p>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <span className="text-xs font-medium text-accent uppercase tracking-wide">Key Achievement</span>
                        <p className="text-foreground font-medium mt-1">{story.achievement}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Other Stories */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-8">
            More Inspiring Journeys
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherStories.map((story) => (
              <div
                key={story.id}
                className="bg-card rounded-xl p-6 shadow-card border border-border card-hover"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 gradient-primary rounded-full flex items-center justify-center text-xl font-bold text-primary-foreground flex-shrink-0">
                    {story.alumniName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{story.alumniName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {story.branch} • {story.graduationYear}
                    </p>
                  </div>
                </div>

                <h4 className="font-semibold text-foreground mb-2">{story.title}</h4>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{story.story}</p>

                <div className="pt-4 border-t border-border">
                  <span className="text-xs font-medium text-accent">Achievement</span>
                  <p className="text-sm text-foreground mt-1">{story.achievement}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {stories.length === 0 && (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <Star className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No stories yet</h3>
            <p className="text-muted-foreground">Be the first to share your success story!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessStories;
