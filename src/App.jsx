// src/App.jsx

import { useAuth } from "./hooks/useAuth";
import { FormularioLogin } from "./components/auth/FormularioLogin";

// Componente temporal para el Panel de Control (Dashboard)
function PanelDeControl() {
    const { usuario, cerrarSesion } = useAuth();

    // El objeto 'usuario' ahora puede estar anidado.
    // Usamos '?' para evitar errores si el objeto no ha cargado.
    const nombreUsuario = usuario?.usuario?.first_name || usuario?.nombre || "Usuario";
    const rolUsuario = usuario?.rol || "No definido";

    return (
        <div className="p-8 text-white">
            <h1 className="text-3xl">¡Bienvenido, {nombreUsuario}!</h1>
            <p>Tu rol es: {rolUsuario}</p>
            <button
                onClick={cerrarSesion}
                className="mt-4 p-2 bg-red-600 rounded-md hover:bg-red-700"
            >
                Cerrar Sesión
            </button>
        </div>
    );
}


function App() {
  const { estaAutenticado } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {estaAutenticado ? <PanelDeControl /> : <FormularioLogin />}
    </div>
  );
}

export default App;