import { useState } from "react";
import { Container, Heading, Text, VStack, Box, FormControl, FormLabel, Input, Textarea, Button, HStack, IconButton, useToast } from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";
import { useTasks, useAddTask, useUpdateTask, useDeleteTask } from "../integrations/supabase/index.js";

const Dashboard = () => {
  const { session } = useSupabaseAuth();
  const { data: tasks, isLoading, isError } = useTasks();
  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const toast = useToast();

  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = async () => {
    try {
      await addTask.mutateAsync({ task_name: taskName, task_description: taskDescription, user_id: session.user.id });
      setTaskName("");
      setTaskDescription("");
      toast({
        title: "Task created.",
        description: "Your task has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error creating task.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateTask = async (task) => {
    try {
      await updateTask.mutateAsync({ ...task, task_name: taskName, task_description: taskDescription });
      setEditingTask(null);
      setTaskName("");
      setTaskDescription("");
      toast({
        title: "Task updated.",
        description: "Your task has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating task.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask.mutateAsync(taskId);
      toast({
        title: "Task deleted.",
        description: "Your task has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting task.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setTaskName(task.task_name);
    setTaskDescription(task.task_description);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setTaskName("");
    setTaskDescription("");
  };

  return (
    <Container centerContent>
      <VStack spacing={4} w="full">
        <Heading as="h1" size="2xl">Dashboard</Heading>
        <Text fontSize="xl">Welcome, {session?.user?.email}!</Text>
        <Text>Here you can manage your tasks and view your progress.</Text>

        <Box w="full" p={4} borderWidth={1} borderRadius="lg">
          <FormControl id="task-name" isRequired>
            <FormLabel>Task Name</FormLabel>
            <Input
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </FormControl>
          <FormControl id="task-description" mt={4}>
            <FormLabel>Task Description</FormLabel>
            <Textarea
              placeholder="Enter task description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </FormControl>
          <Button
            mt={4}
            colorScheme="teal"
            onClick={editingTask ? () => handleUpdateTask(editingTask) : handleAddTask}
          >
            {editingTask ? "Update Task" : "Add Task"}
          </Button>
          {editingTask && (
            <Button mt={4} ml={2} onClick={handleCancelEdit}>
              Cancel
            </Button>
          )}
        </Box>

        <Box w="full" p={4} borderWidth={1} borderRadius="lg">
          <Heading as="h2" size="lg" mb={4}>Your Tasks</Heading>
          {isLoading ? (
            <Text>Loading tasks...</Text>
          ) : isError ? (
            <Text>Error loading tasks.</Text>
          ) : (
            tasks.map((task) => (
              <Box key={task.id} p={4} borderWidth={1} borderRadius="lg" mb={4}>
                <HStack justifyContent="space-between">
                  <Box>
                    <Text fontSize="xl" fontWeight="bold">{task.task_name}</Text>
                    <Text>{task.task_description}</Text>
                  </Box>
                  <HStack>
                    <IconButton
                      icon={<FaEdit />}
                      onClick={() => handleEditClick(task)}
                    />
                    <IconButton
                      icon={<FaTrash />}
                      onClick={() => handleDeleteTask(task.id)}
                    />
                  </HStack>
                </HStack>
              </Box>
            ))
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default Dashboard;