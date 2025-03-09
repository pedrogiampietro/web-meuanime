import { useState } from "react";
import { SignIn } from "phosphor-react";
import { LoginModal } from "./LoginModal";
import { useAuth } from "../contexts/AuthContext";

export function LoginButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-200">{user.email}</span>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        <SignIn size={20} />
        Entrar
      </button>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
