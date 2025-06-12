
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { ChartDataItem, DifficultyChartData } from "../types";

interface PerformanceChartsProps {
  summaryData: ChartDataItem[];
  difficultyData: DifficultyChartData[];
}

const PerformanceCharts = ({ summaryData, difficultyData }: PerformanceChartsProps) => {
  return (
    <div className={`grid grid-cols-1 ${difficultyData.length > 0 ? 'lg:grid-cols-2' : ''} gap-6 mb-8`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-education-blue" />
            Performance Summary
          </CardTitle>
          <CardDescription>
            Distribution of your answers by correctness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summaryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {summaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {difficultyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-education-blue" />
              Difficulty-wise Performance
            </CardTitle>
            <CardDescription>
              How you performed across difficulty levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="correct" name="Correct" fill="#22C55E" />
                  <Bar dataKey="incorrect" name="Incorrect" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceCharts;
