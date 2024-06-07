import { Container, Box, Heading } from "@chakra-ui/react";
import { SupabaseAuthUI } from "../integrations/supabase/auth.jsx";

const Signup = () => {
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