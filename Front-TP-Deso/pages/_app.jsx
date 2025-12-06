import "@/styles/globals.css";
import LayoutHeader from "@/components/LayoutHeader";
import LoginModal from "@/components/LoginModal";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const estaLogueado = sessionStorage.getItem("usuarioLogueado");
    if (estaLogueado === "true") {
      setIsAuthenticated(true);
    }
  }, []);

const handleLogout = () => {
    sessionStorage.removeItem("usuarioLogueado");
    sessionStorage.removeItem("nombreUsuario"); // Añadimos esto para ser completos
    setIsAuthenticated(false); // <--- ESTO ES CLAVE
    router.push('/');
};

  return (
    <>
      {/* Si no está autenticado, mostramos el Modal */}
      {!isAuthenticated && (
        <LoginModal onLoginSuccess={() => setIsAuthenticated(true)} />
      )}

      {/* Si está autenticado, mostramos la App y pasamos la función de Logout */}
      <div style={{ display: isAuthenticated ? 'block' : 'none' }}>
        <LayoutHeader onLogout={handleLogout}>
          <Component {...pageProps} onLogout={handleLogout} /> {/* 👈 PASAMOS LA FUNCIÓN AL COMPONENTE HIJO */}
        </LayoutHeader>
      </div>
    </>
  );
}