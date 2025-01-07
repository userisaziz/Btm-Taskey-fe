import axios from "axios";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
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

const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [predefinedTasks, setPredefinedTasks] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedRoommate, setSelectedRoommate] = useState("");
  const [newRoommate, setNewRoommate] = useState("");
  const [newTaskType, setNewTaskType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await axiosInstance.get("tasks");
        const roommatesResponse = await axiosInstance.get("roommates");
        const taskTypesResponse = await axiosInstance.get("task-types");

        setTasks(tasksResponse.data);
        setRoommates(roommatesResponse.data);
        setPredefinedTasks(
          taskTypesResponse.data.map((type: any) => type.name)
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);
  const handleAddTask = async () => {
    console.log("selectedTask: ", selectedTask, selectedDate, selectedRoommate);
    // if (selectedTask && selectedDate && selectedRoommate) {
    const newTask = {
      name: selectedTask,
      dateCompleted: selectedDate,
      completedBy: selectedRoommate, // Ensure this is the roommate's ID
    };
    console.log("newTask: ", newTask);
    try {
      const response = await axiosInstance.post("tasks", newTask);
      setTasks([...tasks, response.data]);
      setSelectedTask("");
      // setSelectedDate(undefined);
      setSelectedRoommate("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
    // }
  };

  const handleAddRoommate = async () => {
    if (newRoommate) {
      const roommate = { name: newRoommate };
      try {
        const response = await axiosInstance.post("roommates", roommate);
        setRoommates([...roommates, response.data]);
        setNewRoommate("");

        // Add toaster notification
        // toast .success("Roommate added successfully!");

        // Refetch roommates
        const roommatesResponse = await axiosInstance.get("roommates");
        setRoommates(roommatesResponse.data);
      } catch (error) {
        console.error("Failed to add roommate:", error);
        // toast.error("Failed to add roommate.");
      }
    }
  };

  // ... existing code ...

  const handleAddTaskType = async () => {
    if (newTaskType && !predefinedTasks.includes(newTaskType)) {
      try {
        const response = await axiosInstance.post(
          "task-types", // Ensure this endpoint exists
          { name: newTaskType }
        );
        setPredefinedTasks([...predefinedTasks, response.data.name]);
        setNewTaskType("");
      } catch (error) {
        console.error("Failed to add task type:", error);
      }
    }
  };

  // ... existing code ...

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Task</label>
          <Select value={selectedTask} onValueChange={setSelectedTask}>
            <SelectTrigger>
              <SelectValue placeholder="Select task" />
            </SelectTrigger>
            <SelectContent>
              {predefinedTasks.map((task) => (
                <SelectItem key={task} value={task}>
                  {task}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date Completed</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Done By</label>
          <Select value={selectedRoommate} onValueChange={setSelectedRoommate}>
            <SelectTrigger>
              <SelectValue placeholder="Select roommate" />
            </SelectTrigger>
            <SelectContent>
              {roommates.map((roommate) => (
                <SelectItem key={roommate.id} value={roommate.id}>
                  {roommate.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button onClick={handleAddTask} className="w-full">
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Add New Roommate</label>
          <div className="flex gap-2">
            <Input
              placeholder="Roommate name"
              value={newRoommate}
              onChange={(e) => setNewRoommate(e.target.value)}
            />
            <Button onClick={handleAddRoommate} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Add New Task Type</label>
          <div className="flex gap-2">
            <Input
              placeholder="Task type"
              value={newTaskType}
              onChange={(e) => setNewTaskType(e.target.value)}
            />
            <Button onClick={handleAddTaskType} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Date Completed</TableHead>
              <TableHead>Completed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>
                  {format(new Date(task.dateCompleted), "PPP")}
                </TableCell>
                <TableCell>
                  {roommates.find((r) => r.id === task.completedBy)?.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskManagement;
