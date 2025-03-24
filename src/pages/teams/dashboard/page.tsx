import type React from "react";

import { startTransition, Suspense, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamStats from "@/components/teams-dashboard/team-stats";
import TeamLeader from "@/components/teams-dashboard/team-leader";
import TeamMembers from "@/components/teams-dashboard/team-members";
import Projects from "@/components/teams-dashboard/projects";
import TimeTracking from "@/components/teams-dashboard/time-tracking";
import TeamChat from "@/components/teams-dashboard/team-chat";
import UserStories from "@/components/teams-dashboard/user-stories";
import { MountainIcon, Upload, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/api/client-gateway";

export default function TeamDashboard() {
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    startTransition(() => {
      apiClient
        .get(
          "channels/load-channels?team_id=43b31791-43e2-4985-85ce-5eb920082b33"
        )
        .then((response) => {
          setData(response.data);
        });
    });
  }, []);

  // Función para manejar la carga de un nuevo banner
  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerImage(e.target?.result as string);
        setIsEditingBanner(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para eliminar el banner
  const removeBanner = () => {
    setBannerImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      <div className="container mx-auto py-8 px-4">
        {/* Banner personalizable */}
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
          <div
            className={`h-48 w-full bg-gradient-to-r from-primary/30 to-primary/10 flex items-center justify-center relative ${
              bannerImage ? "bg-cover bg-center" : ""
            }`}
            style={
              bannerImage ? { backgroundImage: `url(${bannerImage})` } : {}
            }
          >
            {!bannerImage && !isEditingBanner && (
              <div className="text-center">
                <MountainIcon className="h-16 w-16 text-primary/40 mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Banner personalizable del equipo
                </p>
              </div>
            )}

            {isEditingBanner && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <label
                  htmlFor="banner-upload"
                  className="cursor-pointer bg-primary/10 hover:bg-primary/20 transition-colors rounded-full p-6 mb-3"
                >
                  <Upload className="h-8 w-8 text-primary" />
                </label>
                <p className="text-sm font-medium">
                  Arrastra una imagen o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recomendado: 1200 x 300 px
                </p>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                />
              </div>
            )}

            <div className="absolute bottom-4 right-4 flex space-x-2">
              {bannerImage ? (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={() => setIsEditingBanner(true)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Cambiar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-destructive/80 backdrop-blur-sm hover:bg-destructive/90"
                    onClick={removeBanner}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                  onClick={() => setIsEditingBanner(true)}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {isEditingBanner ? "Cancelar" : "Añadir banner"}
                </Button>
              )}
            </div>
          </div>

          <div className="absolute -bottom-6 left-8 flex items-end">
            <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-lg border-4 border-background">
              <MountainIcon className="h-12 w-12" />
            </div>
          </div>
        </div>

        <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-border/40 pl-32 mt-6">
          <div>
            <div className="flex items-center">
              <Badge className="mr-2 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                Equipo Activo
              </Badge>
              <Badge variant="outline" className="bg-background">
                12 miembros
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mt-1">
              Team Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tu equipo, proyectos y colaboración efectiva
            </p>
          </div>
          <div className="flex space-x-2">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-xs font-medium">
                +3
              </div>
              <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-xs font-medium">
                SC
              </div>
              <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-xs font-medium">
                MR
              </div>
              <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-xs font-medium">
                ET
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TeamStats />
          <TeamLeader />
        </div>

        <div className="mb-8">
          <UserStories />
        </div>

        <Tabs defaultValue="members" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6 p-1 bg-background/50 backdrop-blur-sm border">
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="time">Time Tracking</TabsTrigger>
          </TabsList>
          <TabsContent
            value="members"
            className="animate-in fade-in-50 duration-300"
          >
            <TeamMembers />
          </TabsContent>
          <TabsContent
            value="projects"
            className="animate-in fade-in-50 duration-300"
          >
            <Projects />
          </TabsContent>
          <TabsContent
            value="time"
            className="animate-in fade-in-50 duration-300"
          >
            <TimeTracking />
          </TabsContent>
        </Tabs>

        <Suspense fallback={<div>Loading...</div>}>
          <TeamChat channels={data} />
        </Suspense>
      </div>
    </div>
  );
}
