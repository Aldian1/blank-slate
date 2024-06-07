import { useState } from "react";
import { Container, Heading, Text, VStack, Box, FormControl, FormLabel, Input, Textarea, Button, HStack, IconButton, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Image, SimpleGrid } from "@chakra-ui/react";
import { FaEdit, FaTrash, FaFileAlt } from "react-icons/fa";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";
import { useTasks, useAddTask, useUpdateTask, useDeleteTask, useUserFiles, useAddUserFile, useUpdateUserFile, useDeleteUserFile, supabase } from "../integrations/supabase/index.js";

const Dashboard = () => {
  const { session } = useSupabaseAuth();
  const { data: tasks, isLoading: isLoadingTasks, isError: isErrorTasks } = useTasks();
  const { data: userFiles, isLoading: isLoadingFiles, isError: isErrorFiles } = useUserFiles(session.user.id);
  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const addUserFile = useAddUserFile();
  const updateUserFile = useUpdateUserFile();
  const deleteUserFile = useDeleteUserFile();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [file, setFile] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");

  const handleAddTask = async () => {
    try {
      await addTask.mutateAsync({ task_name: taskName, task_description: taskDescription, user_id: session.user.id });
      setTaskName("");
      setTaskDescription("");
      onClose();
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
      onClose();
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
    onOpen();
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setTaskName("");
    setTaskDescription("");
    onClose();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected.",
        description: "Please select a file to upload.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('user_files').upload(fileName, file);

    if (error) {
      toast({
        title: "Error uploading file.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      const fileUrl = supabase.storage.from('user_files').getPublicUrl(fileName).publicURL;
      await addUserFile.mutateAsync({ user_id: session.user.id, file_name: fileName, file_description: "", file_url: fileUrl });
      toast({
        title: "File uploaded.",
        description: "Your file has been uploaded successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFile(null);
    }
  };

  const handleFileRename = async (file) => {
    try {
      await updateUserFile.mutateAsync({ ...file, file_name: newFileName });
      setEditingFile(null);
      setNewFileName("");
      toast({
        title: "File renamed.",
        description: "Your file has been renamed successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error renaming file.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      await deleteUserFile.mutateAsync(fileId);
      toast({
        title: "File deleted.",
        description: "Your file has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting file.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditFileClick = (file) => {
    setEditingFile(file);
    setNewFileName(file.file_name);
  };

  const handleCancelFileEdit = () => {
    setEditingFile(null);
    setNewFileName("");
  };

  return (
    <Container centerContent>
      <VStack spacing={4} w="full">
        <Heading as="h1" size="2xl">Dashboard</Heading>
        <Text fontSize="xl">Welcome, {session?.user?.email}!</Text>
        <Text>Here you can manage your tasks and files.</Text>

        <Button colorScheme="teal" onClick={onOpen}>Add New Task</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{editingTask ? "Update Task" : "Add New Task"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl id="modal-task-name" isRequired>
                <FormLabel>Task Name</FormLabel>
                <Input
                  placeholder="Enter task name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </FormControl>
              <FormControl id="modal-task-description" mt={4}>
                <FormLabel>Task Description</FormLabel>
                <Textarea
                  placeholder="Enter task description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={editingTask ? () => handleUpdateTask(editingTask) : handleAddTask}>
                {editingTask ? "Update Task" : "Add Task"}
              </Button>
              <Button variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Box p={4} borderWidth={1} borderRadius="lg" w="full">
          <Heading as="h2" size="lg" mb={4}>Your Tasks and Files</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            <Box>
              <Heading as="h3" size="md" mb={4}>Tasks</Heading>
              {isLoadingTasks ? (
                <Text>Loading tasks...</Text>
              ) : isErrorTasks ? (
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

            <Box>
              <Heading as="h3" size="md" mb={4}>Files</Heading>
              <Input type="file" onChange={handleFileChange} />
              <Button colorScheme="teal" onClick={handleFileUpload}>Upload File</Button>
              {isLoadingFiles ? (
                <Text>Loading files...</Text>
              ) : isErrorFiles ? (
                <Text>Error loading files.</Text>
              ) : (
                userFiles.map((file) => (
                  <Box key={file.id} p={4} borderWidth={1} borderRadius="lg" mb={4}>
                    <HStack justifyContent="space-between">
                      <Box>
                        {editingFile && editingFile.id === file.id ? (
                          <Input
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                          />
                        ) : (
                          <>
                            {file.file_name.split('.').pop().match(/(jpg|jpeg|png|gif)$/i) ? (
                              <Image src={file.file_url} alt={file.file_name} boxSize={{ base: "50px", md: "100px" }} objectFit="cover" />
                            ) : (
                              <HStack>
                                <FaFileAlt />
                                <Text fontSize="xl" fontWeight="bold">{file.file_name}</Text>
                              </HStack>
                            )}
                          </>
                        )}
                      </Box>
                      <HStack>
                        {editingFile && editingFile.id === file.id ? (
                          <>
                            <Button onClick={() => handleFileRename(file)}>Save</Button>
                            <Button onClick={handleCancelFileEdit}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <IconButton
                              icon={<FaEdit />}
                              onClick={() => handleEditFileClick(file)}
                            />
                            <IconButton
                              icon={<FaTrash />}
                              onClick={() => handleFileDelete(file.id)}
                            />
                          </>
                        )}
                      </HStack>
                    </HStack>
                  </Box>
                ))
              )}
            </Box>
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
};

export default Dashboard;