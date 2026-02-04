import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const data = [
  { time: '00:00', sms: 120, email: 80, push: 40 },
  { time: '02:00', sms: 80, email: 60, push: 20 },
  { time: '04:00', sms: 40, email: 30, push: 10 },
  { time: '06:00', sms: 150, email: 90, push: 50 },
  { time: '08:00', sms: 380, email: 220, push: 120 },
  { time: '10:00', sms: 520, email: 340, push: 180 },
  { time: '12:00', sms: 480, email: 310, push: 160 },
  { time: '14:00', sms: 560, email: 380, push: 200 },
  { time: '16:00', sms: 620, email: 420, push: 220 },
  { time: '18:00', sms: 440, email: 280, push: 140 },
  { time: '20:00', sms: 280, email: 180, push: 90 },
  { time: '22:00', sms: 180, email: 120, push: 60 },
];

const channels = [
  { key: 'sms', label: 'SMS', color: 'hsl(0, 99%, 64%)' },
  { key: 'email', label: 'Email', color: 'hsl(20, 95%, 58%)' },
  { key: 'push', label: 'Push', color: 'hsl(35, 95%, 55%)' },
];

export function CommunicationChart() {
  const [activeChannels, setActiveChannels] = useState(['sms', 'email', 'push']);

  const toggleChannel = (key: string) => {
    setActiveChannels(prev => 
      prev.includes(key) 
        ? prev.filter(c => c !== key)
        : [...prev, key]
    );
  };

  return (
    <Card variant="glow" className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Communication Volume</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">24-hour message distribution by channel</p>
        </div>
        <div className="flex gap-2">
          {channels.map(channel => (
            <button
              key={channel.key}
              onClick={() => toggleChannel(channel.key)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                activeChannels.includes(channel.key)
                  ? "bg-secondary text-foreground"
                  : "bg-transparent text-muted-foreground hover:bg-secondary/50"
              )}
            >
              <span 
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: activeChannels.includes(channel.key) ? channel.color : 'currentColor' }}
              />
              {channel.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {channels.map(channel => (
                  <linearGradient key={channel.key} id={`gradient-${channel.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={channel.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={channel.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(220, 10%, 55%)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(220, 10%, 55%)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(220, 20%, 10%)', 
                  border: '1px solid hsl(220, 15%, 18%)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              {channels.map(channel => (
                activeChannels.includes(channel.key) && (
                  <Area
                    key={channel.key}
                    type="monotone"
                    dataKey={channel.key}
                    stroke={channel.color}
                    strokeWidth={2}
                    fill={`url(#gradient-${channel.key})`}
                  />
                )
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
