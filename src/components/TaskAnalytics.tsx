import axios from "axios";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MetricCard from "./MetricCard";
import axiosInstance from "@/lib/intercceptor";

interface Task {
  id: string;
  name: string;
  dateCompleted: Date;
  completedBy: string;
}

interface Roommate {
  id: string;
  name: string;
}

const TaskAnalytics = () => {
  const [tasksByRoommate, setTasksByRoommate] = useState<
    { name: string; tasks: number }[]
  >([]);
  const [mostActiveRoommate, setMostActiveRoommate] = useState<{
    name: string;
    tasks: number;
  }>({ name: "No data", tasks: 0 });
  const [leastActiveRoommate, setLeastActiveRoommate] = useState<{
    name: string;
    tasks: number;
  }>({ name: "No data", tasks: Infinity });
  const [monthlyTasksByRoommate, setMonthlyTasksByRoommate] = useState<
    { roommateId: string; month: number; year: number; taskCount: number }[]
  >([]);
  const [roommates, setRoommates] = useState<Roommate[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get("analytics");
        setTasksByRoommate(response.data.tasksByRoommate);
        setMostActiveRoommate(response.data.mostActiveRoommate);
        setLeastActiveRoommate(response.data.leastActiveRoommate);
        setMonthlyTasksByRoommate(response.data.monthlyTasksByRoommate);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };

    const fetchRoommates = async () => {
      try {
        const response = await axiosInstance.get("roommates");
        setRoommates(response.data);
      } catch (error) {
        console.error("Failed to fetch roommates:", error);
      }
    };

    fetchAnalytics();
    fetchRoommates();
  }, []);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = monthlyTasksByRoommate.map((task) => {
    const roommate = roommates.find((r) => r.id === task.roommateId);
    return {
      name: roommate ? roommate.name : "Unknown",
      month: `${monthNames[task.month - 1]} ${task.year}`,
      taskCount: task.taskCount,
    };
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Most Active Roommate"
        value={mostActiveRoommate.tasks}
        color="#7EBF8E"
      />
      <MetricCard
        title="Least Active Roommate"
        value={leastActiveRoommate.tasks}
        color="#FF6B6B"
      />

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Tasks Completed by Roommate</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tasksByRoommate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Monthly Task Completion by Roommate</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="taskCount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskAnalytics;
