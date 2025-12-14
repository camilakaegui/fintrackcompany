import { useState } from "react";
import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

export const WaitlistModal = ({ open, onClose }: WaitlistModalProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('waitlist')
      .insert({ email, full_name: name, reason });

    setLoading(false);

    if (error) {
      if (error.code === '23505') {
        toast.error('Este email ya está en la lista de espera');
      } else {
        toast.error('Error al registrarse');
        console.error(error);
      }
      return;
    }

    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    setEmail('');
    setName('');
    setReason('');
    onClose();
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="bg-card border-border max-w-md text-center">
          <div className="py-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">¡Estás en la lista!</h2>
            <p className="text-muted-foreground mb-6">
              Te notificaremos por email cuando tu acceso sea aprobado.
            </p>
            <Button onClick={handleClose}>
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">Únete a la lista de espera</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Sé de los primeros en probar FinTrack. Te avisaremos cuando esté tu turno.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-muted-foreground text-sm mb-2 block">Nombre</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required
              className="bg-muted/50 border-border"
            />
          </div>
          <div>
            <label className="text-muted-foreground text-sm mb-2 block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="bg-muted/50 border-border"
            />
          </div>
          <div>
            <label className="text-muted-foreground text-sm mb-2 block">¿Por qué te interesa FinTrack? (opcional)</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Cuéntanos un poco..."
              className="bg-muted/50 border-border min-h-[80px]"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Registrando...' : 'Unirme a la lista'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
