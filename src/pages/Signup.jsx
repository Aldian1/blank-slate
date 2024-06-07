import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Heading } from "@chakra-ui/react";
import { SupabaseAuthUI, useSupabaseAuth } from "../integrations/supabase/auth.jsx";

const Signup = () => {
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
          Sign Up
        </Heading>
        <SupabaseAuthUI />
      </Box>
    </Container>
  );
};

export default Signup;