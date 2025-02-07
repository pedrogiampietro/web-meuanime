import React from "react";
import { useStore } from "../../store/useStore";

const ExemploComponent: React.FC = () => {
  const { user, isAuthenticated, setUser } = useStore();

  return (
    <div>
      {isAuthenticated ? (
        <div>Bem-vindo, {user.name}!</div>
      ) : (
        <div>Por favor, faça login</div>
      )}
    </div>
  );
};

export default ExemploComponent;
