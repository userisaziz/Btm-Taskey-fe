import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MetricCard from "@/components/MetricCard";
import MonthlyChart from "@/components/MonthlyChart";
import CustomerRequests from "@/components/CustomerRequests";
import TaskManagement from "@/components/TaskManagement";
import TaskAnalytics from "@/components/TaskAnalytics";

const Index = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex justify-around bg-gray-700 p-6">
          {/* <TabsTrigger value="dashboard" className="px-4 py-2">
            Dashboard
          </TabsTrigger> */}
          <TabsTrigger value="users" className="px-4 py-2">
            Task Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="px-4 py-2">
            Task Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="p-4 lg:p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-medium mb-2">Task Management</h1>
            <p className="text-dashboard-muted">
              Manage roommate tasks and track completion
            </p>
          </header>
          <TaskManagement />
        </TabsContent>
        <TabsContent value="analytics" className="p-4 lg:p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-medium mb-2">Task Analytics</h1>
            <p className="text-dashboard-muted">
              View task completion statistics and roommate performance
            </p>
          </header>
          <TaskAnalytics tasks={[]} roommates={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
