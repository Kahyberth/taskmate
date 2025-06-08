import type React from "react";

import { startTransition, useEffect, useState } from "react";
import TeamStats from "@/components/teams-dashboard/team-stats";
import TeamLeader from "@/components/teams-dashboard/team-leader";
import UserStories from "@/components/teams-dashboard/user-stories";
import { MountainIcon, Upload, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/api/client-gateway";
import { useParams } from "react-router-dom";

export default function TeamDashboard() {
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [leaderData, setLeaderData] = useState<any>(null);
  const [teamInfo, setTeamInfo] = useState<any>(null);
  const { team_id } = useParams<{ team_id: string }>();

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

  const removeBanner = () => {
    setBannerImage(null);
  };

  useEffect(() => {
    if (!team_id) return;
    startTransition(() => {
      apiClient.get(`teams/get-team-by-id/${team_id}`).then((r) => {
        apiClient.get(`auth/profile/${r.data.leaderId}`).then((r) => {
          setLeaderData(r.data);
        });
      });
      apiClient.get(`teams/get-members-by-team/${team_id}`).then((r) => {
        setTeamInfo(r.data);
      });
    });
  }, [team_id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
          <div
            className={`h-48 sm:h-56 md:h-64 w-full bg-gradient-to-r from-primary/30 to-primary/10 flex items-center justify-center relative ${
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
                  Customizable team banner
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
                  Drag an image or click to select
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 1200 x 300 px
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
                    Change
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-destructive/80 backdrop-blur-sm hover:bg-destructive/90"
                    onClick={removeBanner}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
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
                  {isEditingBanner ? "Cancel" : "Add banner"}
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

        <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-border/40 pl-0 md:pl-32 mt-6">
          <div>
            <div className="flex items-center">
              <Badge className="mr-2 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                Active Team
              </Badge>
              <Badge variant="outline" className="bg-background">
                12 members
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mt-1">
              Team Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your team, projects and effective collaboration
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TeamStats />
          <TeamLeader leaderData={leaderData} teamInfo={teamInfo} />
        </div>

        <div className="mb-8">
          <UserStories />
        </div>
      </div>
    </div>
  );
}