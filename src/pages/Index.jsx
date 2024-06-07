import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Heading, VStack, Button } from "@chakra-ui/react";
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
      <Box p={4} maxW="md" w="full">
        <Heading as="h2" size="xl" mb={6} textAlign="center">
          Welcome Back
        </Heading>
        <VStack spacing={4}>
          <SupabaseAuthUI />
          <Button colorScheme="teal" size="lg" w="full" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default Index;