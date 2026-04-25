const AdminNotifications = () => {
  const notifications = [
    { id: '1', title: 'New alumni registration', detail: 'A new alumni account was created.', time: 'Just now' },
    { id: '2', title: 'Job application received', detail: 'A student applied for a posted role.', time: '12 min ago' },
    { id: '3', title: 'Donation confirmed', detail: 'A donation payment was captured successfully.', time: '1 hour ago' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">Recent activity and system alerts.</p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        {notifications.map((item) => (
          <div key={item.id} className="p-4 border-b border-border last:border-b-0">
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
            <p className="text-xs text-muted-foreground mt-2">{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotifications;
