"use client";

import { getAnalytics } from "@/actions/analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import AnalyticsLoading from "./analytics-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMoodById, getMoodTrend } from "@/app/lib/mood";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO } from "date-fns"


const timeOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "15d", label: "Last 15 Days" },
  { value: "30d", label: "Last 30 Days" },
];

function CustomTooltip(props: unknown) {
  const { active, payload, label } = props as {
    active?: boolean;
    payload?: ReadonlyArray<{ value?: number | string }>;
    label?: string;
  };

  if (active && payload && payload.length >= 2) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg text-black">
        <p className="font-medium">
          {typeof label === "string" ? format(parseISO(label), "MMM d, yyyy") : ""}
        </p>
        <p className="text-orange-600">Average Mood: {payload[0]?.value}</p>
        <p className="text-blue-600">Entries: {payload[1]?.value}</p>
      </div>
    );
  }

  return null;
}


const MoodAnalytics = () => {

  const [period, setPeriod] = useState("7d");

  const {
    loading,
    data: analytics,
    fn: fetchAnalytics,
  } = useFetch(getAnalytics);

  const { isLoaded } = useUser();

  console.log("Analytics Data:", analytics)

  useEffect(() => {
    void fetchAnalytics(period);
  }, [period, fetchAnalytics]);

  if (loading || !analytics?.data || !isLoaded) {
    return <AnalyticsLoading />
  }

  const { timeline, stats } = analytics.data;

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-5xl font-bold gradient-title">Dashboard</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((optional) => (
              <SelectItem key={optional.value} value={optional.value}>
                {optional.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalEntries}</p>
              <p className="text-xs text-muted-foreground">
                ~{stats.dailyAverage} entries per day
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.averageScore}</p>
              <p className="text-xs text-muted-foreground">
                Overall Mood Score
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Mood Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2 ">
                {getMoodById(stats?.mostFrequentMood)?.emoji}{" "}
                {getMoodTrend(stats.averageScore)}
              </div>
            </CardContent>
          </Card>

        </div>

        {/**Timeline Chart*/}
        <Card>
          <CardHeader>
            <CardTitle>Mood Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timeline}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(parseISO(date), "MMM d")}
                  />
                  <YAxis yAxisId="left" domain={[0, 10]} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, "auto"]}
                  />
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="averageScore"
                    stroke="#f97316"
                    name="Average Mood"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="entryCount"
                    stroke="#3b82f6"
                    name="Number of Entries"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>


      </div>
    </>

  )
}

export default MoodAnalytics