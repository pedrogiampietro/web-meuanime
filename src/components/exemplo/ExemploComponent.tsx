import { useStore } from "../../store/useStore";

export function ExemploComponent() {
  const { user, isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return <div>Por favor, faça login para continuar.</div>;
  }

  return <div>Bem-vindo, {user?.name || "Usuário"}!</div>;
}
