import { Container, Heading, Text, VStack } from "@chakra-ui/react";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";

const Dashboard = () => {
  const { session } = useSupabaseAuth();

  return (
    <Container centerContent>
      <VStack spacing={4}>
        <Heading as="h1" size="2xl">Dashboard</Heading>
        <Text fontSize="xl">Welcome, {session?.user?.email}!</Text>
        <Text>Here you can manage your tasks and view your progress.</Text>
      </VStack>
    </Container>
  );
};

export default Dashboard;