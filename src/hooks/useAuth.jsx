// src/hooks/useAuth.jsx

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"; // 1. Importamos axios

const AuthContext = createContext();

// 2. Construimos la URL base de la API usando la variable de entorno
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";


export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("condominio_usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  // 3. Modificamos la función iniciarSesion
  const iniciarSesion = async (email, password) => {
    try {
      // Hacemos una petición POST al backend
      // NOTA: He asumido que la ruta es '/auth/login'.
      // ¡Debes verificar esto! Podría ser '/login', '/usuarios/login', etc.
      const respuesta = await axios.post(`${API_URL}/auth/login`, {
        email: email,
        password: password,
      });

      // Si la petición es exitosa (código 200-299)
      if (respuesta.data) {
        // Asumimos que el backend devuelve el objeto del usuario y quizás un token
        const datosUsuario = respuesta.data.user; // O como se llame el objeto de usuario en la respuesta
        
        setUsuario(datosUsuario);
        localStorage.setItem("condominio_usuario", JSON.stringify(datosUsuario));
        
        // Si el backend devuelve un token, también lo guardamos
        if (respuesta.data.token) {
            localStorage.setItem("condominio_token", respuesta.data.token);
            // Configuramos axios para que envíe este token en futuras peticiones
            axios.defaults.headers.common['Authorization'] = `Bearer ${respuesta.data.token}`;
        }
        
        return true;
      }
      return false;

    } catch (error) {
      // Si el backend devuelve un error (ej. 401 credenciales incorrectas)
      console.error("Error en el inicio de sesión:", error.response?.data?.message || error.message);
      return false;
    }
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem("condominio_usuario");
    localStorage.removeItem("condominio_token"); // También borramos el token
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        estaAutenticado: !!usuario,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}