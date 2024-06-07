import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Heading, VStack, Text } from "@chakra-ui/react";
import { SupabaseAuthUI, useSupabaseAuth } from "../integrations/supabase/auth.jsx";

const Index = () => {
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  return (
    <Container centerContent>
      <VStack spacing={8} p={4} maxW="md" w="full">
        <Heading as="h1" size="2xl" textAlign="center">
          Welcome to Our App
        </Heading>
        <Text fontSize="lg" textAlign="center">
          Please log in to continue
        </Text>
        <Box w="full">
          <SupabaseAuthUI />
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;