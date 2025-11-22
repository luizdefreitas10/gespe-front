"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@heroui/button";

export default function UserPage() {
  const { handleSignOut } = useAuthContext();
  return (
    <div>
      <h1>User GestorPage</h1>
      <Button onPress={handleSignOut}>Sair</Button>
    </div>
  );
}
