import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface AlertBoxProps {
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
}

const AlertBox = ({ severity, message, timestamp }: AlertBoxProps) => {
  const severityConfig = {
    low: {
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/30',
      emoji: '🟢',
    },
    medium: {
      icon: Info,
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      emoji: '🟡',
    },
    high: {
      icon: AlertTriangle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
      emoji: '🔴',
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <Card className={`${config.bg} ${config.border} border-2 transition-all hover:scale-[1.02]`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{config.emoji}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-5 w-5 ${config.color}`} />
              <span className={`font-semibold ${config.color} uppercase text-sm`}>
                {severity} Alert
              </span>
            </div>
            <p className="text-sm mb-1">{message}</p>
            <p className="text-xs text-muted-foreground">{timestamp}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertBox;
