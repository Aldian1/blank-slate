import { useState } from "react";
import { Container, Heading, VStack, Input, Button, useToast, Box, HStack, IconButton, Text, Image } from "@chakra-ui/react";
import { supabase, useUserFiles, useAddUserFile, useUpdateUserFile, useDeleteUserFile } from "../integrations/supabase/index.js";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";
import { FaEdit, FaTrash, FaFileAlt } from "react-icons/fa";

const Files = () => {
  const { session } = useSupabaseAuth();
  const { data: userFiles, isLoading, isError } = useUserFiles(session.user.id);
  const addUserFile = useAddUserFile();
  const updateUserFile = useUpdateUserFile();
  const deleteUserFile = useDeleteUserFile();
  const [file, setFile] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const toast = useToast();

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

  const handleEditClick = (file) => {
    setEditingFile(file);
    setNewFileName(file.file_name);
  };

  const handleCancelEdit = () => {
    setEditingFile(null);
    setNewFileName("");
  };

  return (
    <Container centerContent>
      <VStack spacing={4} w="full">
        <Heading as="h1" size="2xl">Upload Files</Heading>
        <Input type="file" onChange={handleFileChange} />
        <Button colorScheme="teal" onClick={handleFileUpload}>Upload File</Button>

        <Box w="full" p={4} borderWidth={1} borderRadius="lg">
          <Heading as="h2" size="lg" mb={4}>Your Files</Heading>
          {isLoading ? (
            <Text>Loading files...</Text>
          ) : isError ? (
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
                        <Button onClick={handleCancelEdit}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <IconButton
                          icon={<FaEdit />}
                          onClick={() => handleEditClick(file)}
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
      </VStack>
    </Container>
  );
};

export default Files;