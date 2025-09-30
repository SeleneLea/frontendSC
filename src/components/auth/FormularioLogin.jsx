// src/components/auth/FormularioLogin.jsx

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";

// Importamos los componentes de UI que acabamos de copiar
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";

// Iconos para darle un toque visual
import { Building2 } from 'lucide-react';


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
        setError("Credenciales inválidas. Por favor, verifica tus datos.");
      }
    } catch (err) {
      setError("Ocurrió un error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-md">
        <div className="text-center space-y-2 mb-6">
            <div className="inline-block p-3 bg-primary rounded-lg">
                <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">SmartCondo</h1>
            <p className="text-muted-foreground">Sistema de Administración Inteligente</p>
        </div>

        <Card>
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={manejarSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico (username)</Label>
                        <Input
                            id="email"
                            type="text" // Cambiado a text para aceptar usernames que no son emails
                            placeholder="tu.usuario"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={cargando}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={cargando}
                        />
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={cargando}>
                        {cargando ? "Iniciando sesión..." : "Ingresar"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}