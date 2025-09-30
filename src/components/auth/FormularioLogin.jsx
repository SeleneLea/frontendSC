
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";

export function FormularioLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { iniciarSesion } = useAuth();

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const exito = await iniciarSesion(email, password);
      if (!exito) {
        setError("Credenciales inválidas. Intenta de nuevo.");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intenta de nuevo más tarde.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-8 border rounded-lg shadow-lg bg-slate-900 border-slate-700 text-white">
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">SmartCondo</h1>
            <p className="text-gray-400">Sistema de Administración Inteligente</p>
        </div>
        <form onSubmit={manejarSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">Correo Electrónico</label>
                <input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={cargando}
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">Contraseña</label>
                <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={cargando}
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {error && (
                <div className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-md">
                    <p>{error}</p>
                </div>
            )}

            <button type="submit" className="w-full p-2 bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400" disabled={cargando}>
                {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
        </form>

        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-sm font-medium mb-2 text-gray-300">Usuarios de prueba:</p>
            <div className="space-y-1 text-xs text-gray-400">
                <p><strong>Admin:</strong> admin@condominio.com</p>
                <p><strong>Residente:</strong> residente@condominio.com</p>
                <p><strong>Contraseña:</strong> demo123</p>
            </div>
        </div>
    </div>
  );
}