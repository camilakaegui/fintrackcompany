import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AccessPending = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-yellow-500/20 flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Acceso pendiente</h1>
        <p className="text-muted-foreground mb-6">
          Tu cuenta está en lista de espera. Te notificaremos por email cuando tu acceso sea aprobado.
        </p>
        <Button variant="outline" onClick={signOut}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
};

export default AccessPending;
