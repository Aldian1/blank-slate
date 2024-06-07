import { Box, Flex, Link, Button, useColorModeValue, Stack, useColorMode, HStack } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";

export default function Navbar() {
  const { session, logout } = useSupabaseAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <Box>Logo</Box>
            <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
              <Link as={RouterLink} to="/">Home</Link>
              {!session && <Link as={RouterLink} to="/login">Login</Link>}
              {!session && <Link as={RouterLink} to="/signup">Signup</Link>}
              {session && <Link as={RouterLink} to="/dashboard">Dashboard</Link>}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              {session && <Button onClick={logout}>Logout</Button>}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}