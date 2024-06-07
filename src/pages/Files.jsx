import { useState } from "react";
import { Container, Heading, VStack, Input, Button, useToast } from "@chakra-ui/react";
import { supabase } from "../integrations/supabase/index.js";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";

const Files = () => {
  const { session } = useSupabaseAuth();
  const [file, setFile] = useState(null);
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
    const { error } = await supabase.storage.from('user-files').upload(fileName, file);

    if (error) {
      toast({
        title: "Error uploading file.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
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

  return (
    <Container centerContent>
      <VStack spacing={4} w="full">
        <Heading as="h1" size="2xl">Upload Files</Heading>
        <Input type="file" onChange={handleFileChange} />
        <Button colorScheme="teal" onClick={handleFileUpload}>Upload File</Button>
      </VStack>
    </Container>
  );
};

export default Files;