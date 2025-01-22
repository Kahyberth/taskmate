import { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { AuthContext } from "@/context/AuthProvider";
import { VotingScale } from "@/enums/room-scale.enum";

export function CreateRoomDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [scale, setScale] = useState("fibonacci");
  const [code, setCode] = useState("");

  const { user } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/poker/create-session`, {
        session_name: roomName,
        description,
        created_by: user?.id,
        voting_scale: scale,
        session_code: code,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error al crear la sala:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Crear nueva sala de Planning Poker</DialogTitle>
          <DialogDescription>
            Configura una nueva sesión de Planning Poker para tu equipo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">Nombre de la sala</Label>
            <Input
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Ej: Sprint 23 Planning"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Seguridad y detalles... "
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Proyecto</Label>
            <Select
              value={project}
              onValueChange={(value) => setProject(value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un proyecto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ecommerce">E-commerce Platform</SelectItem>
                <SelectItem value="inventory">Inventory System</SelectItem>
                <SelectItem value="mobile">Mobile App</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Escala de votación</Label>
            <Select
              value={scale}
              onValueChange={(value) => setScale(value)}
              defaultValue="fibonacci"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una escala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VotingScale.FIBONACCI}>
                  Fibonacci (1,2,3,5,8,13,21)
                </SelectItem>
                <SelectItem value={VotingScale.MODIFIED_FIBONNACI}>
                  Modificada (0,½,1,2,3,5,8,13,20,40,100)
                </SelectItem>
                <SelectItem value={VotingScale.TSHIRT}>
                  Tallas (XS,S,M,L,XL)
                </SelectItem>
              </SelectContent>
            </Select>
            {auth && (
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  maxLength={6}
                  type="password"
                  placeholder="Ej: A123..."
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="assignCode"
                checked={auth}
                onCheckedChange={() => setAuth(!auth)}
              />
              <Label htmlFor="assignCode">Asignar código</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="autoReveal" />
              <Label htmlFor="autoReveal">Revelar votos automáticamente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="timer" />
              <Label htmlFor="timer">Activar temporizador de votación</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear sala"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
