import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Usamos la variable de entorno que configuramos.
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://smart-condominium-backend-cg7l.onrender.com/api";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Al cargar la app, revisa si hay un usuario y un token guardados
    const usuarioGuardado = localStorage.getItem("condominio_usuario");
    const tokenGuardado = localStorage.getItem("condominio_token");
    if (usuarioGuardado && tokenGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
      // Importante: Configura axios para que use el token en todas las futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Token ${tokenGuardado}`;
    }
  }, []);

  const iniciarSesion = async (email, password) => {
    try {
      const respuestaLogin = await axios.post(`${API_URL}/usuarios/login/`, {
        username: email,
        password: password,
      });

      // Si la petición de login es exitosa, el backend nos devuelve un token
      if (respuestaLogin.data.token) {
        const token = respuestaLogin.data.token;
        
        // Guardamos el token en localStorage
        localStorage.setItem("condominio_token", token);
        
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;

        // Hacemos una segunda llamada para obtener la información del perfil
        const respuestaPerfil = await axios.get(`${API_URL}/usuarios/perfil/`);

        if (respuestaPerfil.data) {
          // Guardamos los datos completos del usuario
          setUsuario(respuestaPerfil.data);
          localStorage.setItem("condominio_usuario", JSON.stringify(respuestaPerfil.data));
          return true;
        }
      }
      return false;

    } catch (error) {
      console.error("Error en el inicio de sesión:", error.response?.data || error.message);
      // Limpiamos cualquier dato viejo si el login falla
      cerrarSesion(); 
      return false;
    }
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem("condominio_usuario");
    localStorage.removeItem("condominio_token");
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