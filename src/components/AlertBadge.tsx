import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface AlertBadgeProps {
  severity: 'low' | 'medium' | 'high';
  count?: number;
  showIcon?: boolean;
}

export function AlertBadge({ severity, count, showIcon = true }: AlertBadgeProps) {
  const config = {
    low: {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      icon: Info,
      label: 'Low',
    },
    medium: {
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-200',
      icon: AlertCircle,
      label: 'Medium',
    },
    high: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      icon: AlertTriangle,
      label: 'High',
    },
  };

  const { bgColor, textColor, borderColor, icon: Icon, label } = config[severity];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgColor} ${textColor} ${borderColor}`}
    >
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {label}
      {count !== undefined && count > 0 && ` (${count})`}
    </span>
  );
}
