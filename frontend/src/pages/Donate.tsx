import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Donation } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Gift, 
  GraduationCap, 
  Building2, 
  Microscope, 
  Heart,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

const Donate = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState<Donation['purpose']>('scholarship');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const purposes = [
    { id: 'scholarship', label: 'Scholarships', icon: GraduationCap, description: 'Support deserving students with financial aid' },
    { id: 'infrastructure', label: 'Infrastructure', icon: Building2, description: 'Help build new facilities and upgrade existing ones' },
    { id: 'research', label: 'Research', icon: Microscope, description: 'Fund innovative research projects and labs' },
    { id: 'general', label: 'General Fund', icon: Heart, description: 'Support various university initiatives' },
  ];

  const presetAmounts = [1000, 5000, 10000, 25000, 50000];

  const handleDonate = async () => {
    if (!user) {
      toast.error('Please login to make a donation');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);

    try {
      const orderResponse = await api.donations.order({ amount: parseFloat(amount), purpose, message });
      const order = orderResponse.data as { orderId?: string; transactionId?: string; id?: string; provider?: string };

      await api.donations.confirm({
        orderId: order.orderId ?? order.id ?? '',
        transactionId: order.transactionId ?? `TXN${Date.now()}`,
        amount: parseFloat(amount),
        purpose,
        message,
        provider: order.provider || 'manual',
      });

      setTransactionId(order.transactionId ?? order.orderId ?? `TXN${Date.now()}`);
      setShowSuccess(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Donation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
        <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border text-center max-w-md w-full animate-scale-in">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Thank You!</h1>
          <p className="text-muted-foreground mb-6">
            Your generous donation of ₹{parseFloat(amount).toLocaleString('en-IN')} has been received.
          </p>
          <div className="bg-muted rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-muted-foreground">Transaction ID</p>
            <p className="font-mono text-foreground">{transactionId}</p>
          </div>
          <Button 
            onClick={() => {
              setShowSuccess(false);
              setAmount('');
              setMessage('');
              setTransactionId('');
            }}
            className="w-full"
          >
            Make Another Donation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="gradient-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <Gift className="w-12 h-12 mx-auto mb-4 text-secondary" />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Give Back</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Your contribution helps shape the future of education and supports the next generation of leaders
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Donation Form */}
            <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Make a Donation</h2>

              {/* Purpose Selection */}
              <div className="mb-6">
                <Label className="text-base mb-4 block">Select Purpose</Label>
                <div className="grid grid-cols-2 gap-3">
                  {purposes.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPurpose(p.id as Donation['purpose'])}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                        purpose === p.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <p.icon className={cn('w-6 h-6 mb-2', purpose === p.id ? 'text-primary' : 'text-muted-foreground')} />
                      <div className={cn('font-semibold text-sm', purpose === p.id ? 'text-primary' : 'text-foreground')}>
                        {p.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-6">
                <Label className="text-base mb-4 block">Donation Amount (₹)</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset.toString())}
                      className={cn(
                        'px-4 py-2 rounded-lg border transition-all',
                        amount === preset.toString()
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      )}
                    >
                      ₹{preset.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <Input
                  type="number"
                  placeholder="Or enter custom amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <Label className="text-base mb-2 block">Message (Optional)</Label>
                <Textarea
                  placeholder="Leave a message with your donation..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Donate Button */}
              <Button
                onClick={handleDonate}
                disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                className="w-full h-14 text-lg gradient-gold text-secondary-foreground btn-glow"
              >
                {isProcessing ? (
                  'Processing...'
                ) : amount ? (
                  `Donate ₹${parseFloat(amount).toLocaleString('en-IN')}`
                ) : (
                  'Enter Amount'
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                {import.meta.env.PROD ? 'Payments are processed through the configured gateway.' : 'Development mode uses the backend payment fallback when gateway keys are missing.'}
              </p>
            </div>

            {/* Impact Section */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
                <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Your Impact
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">₹2.5 Cr+</div>
                    <div className="text-sm text-muted-foreground">Total donations received</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-accent">150+</div>
                    <div className="text-sm text-muted-foreground">Students supported through scholarships</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">12</div>
                    <div className="text-sm text-muted-foreground">Research projects funded</div>
                  </div>
                </div>
              </div>

              {/* Purpose Details */}
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
                <h3 className="font-semibold text-lg text-foreground mb-4">
                  About {purposes.find(p => p.id === purpose)?.label}
                </h3>
                <p className="text-muted-foreground">
                  {purposes.find(p => p.id === purpose)?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
