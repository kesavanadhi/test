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
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-navy-950/60 border border-slate-800/80">
        <p className="text-xs font-bold text-slate-300">No Mock Test Progress Recorded Yet</p>
        <p className="text-[11px] text-slate-500 max-w-xs mt-1">
          Complete a mock test to view your performance progression trajectory graph.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-navy-950/60 border border-slate-800/80">
        <p className="text-xs font-bold text-slate-300">No Subject Accuracy Data Available</p>
        <p className="text-[11px] text-slate-500 max-w-xs mt-1">
          Subject-wise strength breakdown will update once mock test submissions are recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
  const total = correct + wrong + unanswered;

  if (total === 0) {
    return (
      <div className="w-full h-56 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-navy-950/60 border border-slate-800/80">
        <p className="text-xs font-bold text-slate-400">No Question Attempts Logged</p>
        <p className="text-[11px] text-slate-500 mt-1">Accuracy distribution appears after taking tests.</p>
      </div>
    );
  }

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

