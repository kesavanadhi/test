import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export interface ScoreDataPoint {
  testName: string;
  score: number;
  percentage: number;
  date: string;
}

export const ScoreProgressionChart: React.FC<{ data: ScoreDataPoint[] }> = ({ data }) => {
  const chartData = data.length > 0 ? data : [
    { testName: 'Mock 1', percentage: 65, date: '01 Feb' },
    { testName: 'Mock 2', percentage: 72, date: '05 Feb' },
    { testName: 'Mock 3', percentage: 68, date: '10 Feb' },
    { testName: 'Mock 4', percentage: 84, date: '15 Feb' },
    { testName: 'Mock 5', percentage: 89, date: '20 Feb' },
    { testName: 'Mock 6', percentage: 94, date: '22 Feb' },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#40916C" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#40916C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="testName" stroke="#64748b" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0B1536',
              borderColor: '#2D6A4F',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="percentage"
            stroke="#52B788"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#scoreGradient)"
            name="Score %"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SubjectPerformanceChart: React.FC<{
  data?: { subject: string; accuracy: number; total: number }[];
}> = ({ data }) => {
  const chartData = data || [
    { subject: 'English', accuracy: 88, total: 50 },
    { subject: 'General Knowledge', accuracy: 74, total: 50 },
    { subject: 'Elementary Maths', accuracy: 92, total: 50 },
    { subject: 'Military Aptitude', accuracy: 95, total: 30 },
    { subject: 'Reasoning', accuracy: 86, total: 40 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 10 }} />
          <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0B1536',
              borderColor: '#2D6A4F',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="accuracy" name="Accuracy %" fill="#2D6A4F" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CorrectWrongDonutChart: React.FC<{
  correct: number;
  wrong: number;
  unanswered: number;
}> = ({ correct, wrong, unanswered }) => {
  const data = [
    { name: 'Correct', value: correct, color: '#40916C' },
    { name: 'Incorrect', value: wrong, color: '#EF4444' },
    { name: 'Unanswered', value: unanswered, color: '#475569' },
  ];

  return (
    <div className="w-full h-56 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#070F2B" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0B1536',
              borderColor: '#2D6A4F',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
