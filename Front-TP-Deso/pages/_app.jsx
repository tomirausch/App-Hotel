import "@/styles/globals.css";
import LayoutHeader from "@/components/LayoutHeader";
import LoginModal from "@/components/LoginModal";
import { useState, useEffect } from "react";

export default function App({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // (Opcional) Verificar si ya estaba logueado al recargar
  useEffect(() => {
    const estaLogueado = sessionStorage.getItem("usuarioLogueado");
    if (estaLogueado === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      {!isAuthenticated && (
        <LoginModal onLoginSuccess={() => setIsAuthenticated(true)} />
      )}

      {/* Mientras no esté autenticado, el contenido de abajo se renderiza pero 
          el LoginModal con z-index alto lo tapa completamente.
          Si prefieres que NO se renderice nada, envuelve lo de abajo en {isAuthenticated && ...} */}
      
      <div style={{ display: isAuthenticated ? 'block' : 'none' }}>
          <LayoutHeader>
            <Component {...pageProps} />
          </LayoutHeader>
      </div>
    </>
  );
}