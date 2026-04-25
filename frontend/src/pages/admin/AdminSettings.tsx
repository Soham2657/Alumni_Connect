const AdminSettings = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage platform preferences and admin controls.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="bg-card rounded-xl p-6 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-2">General</h2>
          <p className="text-sm text-muted-foreground">Global platform settings will appear here.</p>
        </section>

        <section className="bg-card rounded-xl p-6 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-2">Security</h2>
          <p className="text-sm text-muted-foreground">Password policies and access controls can be managed here.</p>
        </section>

        <section className="bg-card rounded-xl p-6 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-2">Notifications</h2>
          <p className="text-sm text-muted-foreground">Email and in-app notification preferences can be configured here.</p>
        </section>

        <section className="bg-card rounded-xl p-6 shadow-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-2">Integrations</h2>
          <p className="text-sm text-muted-foreground">Configure payment and AI integration settings.</p>
        </section>
      </div>
    </div>
  );
};

export default AdminSettings;
