import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StepCard } from '@/components/ui/StepCard';
import { TrendingUp } from 'lucide-react';
import type { Course } from '@/components/CourseManagement';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(210, 70%, 55%)',
  'hsl(330, 65%, 55%)',
];

function generateTrendData(courses: Course[]) {
  const enabledCourses = courses.filter(c => c.enabled);
  const days = ['03/01', '03/03', '03/05', '03/07', '03/09', '03/11', '03/13', '03/15'];

  return days.map((day, dayIdx) => {
    const entry: Record<string, string | number> = { date: day };
    enabledCourses.forEach(course => {
      const progress = Math.min(1, (dayIdx + 1) / days.length);
      const noise = Math.round((Math.sin(dayIdx * 1.5 + parseInt(course.id) * 2) + 1) * 3);
      entry[course.name] = Math.min(
        course.capacity,
        Math.round(course.enrolled * progress * 0.85 + noise)
      );
    });
    return entry;
  });
}

interface Props {
  courses: Course[];
}

export function EnrollmentTrendChart({ courses }: Props) {
  const enabledCourses = courses.filter(c => c.enabled);
  const data = useMemo(() => generateTrendData(courses), [courses]);

  return (
    <StepCard step={3} title="課程報名趨勢">
      <p className="text-xs text-muted-foreground mb-4">
        各課程每日累積報名人數變化（模擬資料）
      </p>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 12px hsl(var(--foreground) / 0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
              iconSize={8}
            />
            {enabledCourses.map((course, i) => (
              <Line
                key={course.id}
                type="monotone"
                dataKey={course.name}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2 }}
                activeDot={{ r: 5, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </StepCard>
  );
}
