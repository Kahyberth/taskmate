import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/api/client-gateway";


interface TokenPayload {
  inviteeEmail: string;
  teamId: string;
  roleInTeam: string;
  iat: number;
  exp: number;
}

export default function InvitationVerify() {
  const [searchParams] = useSearchParams();
  const [verificationState, setVerificationState] = useState<"loading" | "verified" | "invalid">("loading");
  const [tokenData, setTokenData] = useState<TokenPayload>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Estados para el proceso de aceptación de la invitación
  const [acceptState, setAcceptState] = useState<"idle" | "loading" | "accepted" | "error">("idle");
  const [acceptErrorMessage, setAcceptErrorMessage] = useState<string>("");



  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get("token");
        if (!token) {
          throw new Error("No se encontró el token de invitación");
        }

        console.log("token", token);
    
        await apiClient.post(`/teams/validate-invite-link`, { token });
        
        const parts = token.split(".");
        if (parts.length !== 3) {
          throw new Error("Formato de token inválido");
        }
        const payload = parts[1];
        const decodedData = JSON.parse(atob(payload)) as TokenPayload;
        console.log(decodedData);
        setTokenData(decodedData);
        setVerificationState("verified");
      } catch (error) {
        setVerificationState("invalid");
        setErrorMessage(
          error instanceof Error ? error.message : "Error al verificar el token de invitación"
        );
      }
    };

    verifyToken();
  }, [searchParams]);

  const handleAcceptInvitation = async () => {
    setAcceptState("loading");
    try {
      const token = searchParams.get("token");

      if (!token) {
        throw new Error("No se encontró el token de invitación");
      }
      
      await apiClient.post(`/teams/accept-invite`, { token, inviteeEmail: tokenData?.inviteeEmail });
      setAcceptState("accepted");
    } catch (error) {
      setAcceptState("error");
      setAcceptErrorMessage(
        error instanceof Error ? error.message : "Error al aceptar la invitación"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">TaskMate</CardTitle>
          <CardDescription>Verificación de Invitación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            {verificationState === "loading" && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Verificando el token de invitación...</p>
              </div>
            )}

            {verificationState === "verified" && tokenData && (
              <div className="flex flex-col items-center space-y-4">
                {acceptState !== "accepted" ? (
                  <>
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Invitación Verificada</h3>
                      <p className="text-sm text-muted-foreground">
                        Has sido invitado a unirte al equipo <strong>{tokenData.teamId}</strong> como{" "}
                        <strong>{tokenData.roleInTeam}</strong>.
                      </p>
                    </div>
                    <div className="w-full space-y-4 pt-4">
                      <Button
                        onClick={handleAcceptInvitation}
                        className="w-full"
                        size="lg"
                        disabled={acceptState === "loading"}
                      >
                        {acceptState === "loading" ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          "Aceptar e Ingresar al Equipo"
                        )}
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        Rechazar Invitación
                      </Button>
                    </div>
                    {acceptState === "error" && (
                      <p className="text-sm text-destructive">{acceptErrorMessage}</p>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                    <h3 className="font-semibold">¡Invitación Aceptada!</h3>
                    <p className="text-sm text-muted-foreground">
                      Te has unido exitosamente al equipo.
                    </p>
                  </div>
                )}
              </div>
            )}

            {verificationState === "invalid" && (
              <div className="flex flex-col items-center space-y-4">
                <XCircle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                  <h3 className="font-semibold">Invitación Inválida</h3>
                  <p className="text-sm text-muted-foreground">{errorMessage}</p>
                </div>
                <Button variant="outline" className="mt-4" size="lg">
                  Regresar al Inicio
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
