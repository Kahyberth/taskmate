import { startTransition, useEffect, useState } from "react";
import { MountainIcon, Users, FolderOpen, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { apiClient } from "@/api/client-gateway";
import { useParams } from "react-router-dom";

import TeamMembers from "@/components/teams-dashboard/team-members";
import TeamLeader from "@/components/teams-dashboard/team-leader";

interface TeamMemberWithProfile {
  id: string;
  name?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  company?: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
  location?: string;
  skills?: string;
  isActive?: boolean;
  role?: string;
  joinedAt?: string;
  github?: string | null;
  linkedin?: string | null;
}

interface TeamData {
  id: string;
  name?: string;
  description?: string;
  leaderId?: string;
  image?: string;
}

export default function TeamDashboard() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithProfile[]>([]);
  const [teamProjects, setTeamProjects] = useState<any[]>([]);
  const [leaderData, setLeaderData] = useState<TeamMemberWithProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const { team_id } = useParams<{ team_id: string }>();

  useEffect(() => {
    if (!team_id) return;

    setLoading(true);
    startTransition(() => {
      // Get team data
      apiClient
        .get(`teams/get-team-by-id/${team_id}`)
        .then((teamResponse) => {
          const teamInfo = teamResponse.data;
          setTeamData(teamInfo);

          // Get team members
          return apiClient
            .get(`teams/get-members-by-team/${team_id}`)
            .then((membersResponse) => {
              const members = membersResponse.data;

              // Get detailed profile for each member
              const profilePromises = members.map((memberData: any) => {
                // Extract user data from the nested structure
                const userData = memberData.member || memberData;
                const userId = userData.id;

                if (!userId) {
                  return Promise.resolve({
                    id: Date.now().toString(),
                    name: "Unknown User",
                    email: "No email available",
                    role: "Member",
                  });
                }

                return apiClient
                  .get(`auth/profile/${userId}`)
                  .then((profileResponse) => {
                    const userProfile = profileResponse.data;
                    const additionalProfile = userProfile.profile || {};

                    let socialLinks = {};
                    try {
                      if (additionalProfile.social_links) {
                        socialLinks = JSON.parse(
                          additionalProfile.social_links
                        );
                      }
                    } catch (error) {
                      socialLinks = {};
                    }

                    return {
                      id: userId,
                      name: userData.name?.trim() || userProfile.name?.trim(),
                      lastName:
                        userData.lastName?.trim() ||
                        userProfile.lastName?.trim(),
                      email: userData.email || userProfile.email,
                      avatar:
                        additionalProfile.profile_picture ||
                        additionalProfile.avatar,
                      company: userData.company || userProfile.company,
                      phone: userData.phone || userProfile.phone,
                      department: userData.department || userProfile.department,
                      position: additionalProfile.position,
                      bio: additionalProfile.bio,
                      location: additionalProfile.location,
                      expirience: additionalProfile.experience,
                      skills: additionalProfile.skills,
                      isActive: userData.isActive,
                      role: memberData.role || "Member",
                      joinedAt:
                        memberData.joinedAt ||
                        memberData.createdAt ||
                        userData.createdAt,
                      github: (socialLinks as any)?.github || null,
                      linkedin: (socialLinks as any)?.linkedin || null,
                    };
                  })
                  .catch((error) => {
                    console.log(
                      `Error fetching profile for user ${userId}:`,
                      error
                    );
                    return {
                      id: userId,
                      name: userData.name?.trim() || "Unknown User",
                      lastName: userData.lastName?.trim(),
                      email: userData.email || "No email available",
                      company: userData.company,
                      phone: userData.phone,
                      isActive: userData.isActive,
                      role: memberData.role || "Member",
                      joinedAt:
                        memberData.joinedAt ||
                        memberData.createdAt ||
                        userData.createdAt,
                      github: null,
                      linkedin: null,
                    };
                  });
              });

              return Promise.all(profilePromises).then(
                (membersWithProfiles) => {
                  setTeamMembers(membersWithProfiles);
                  // Filter team leader from members
                  if (teamInfo?.leaderId) {
                    const leader = membersWithProfiles.find(
                      (member) => member.id === teamInfo.leaderId
                    );
                    console.log("leader", leader);
                    setLeaderData(leader || null);
                  }
                  return membersWithProfiles;
                }
              );
            });
        })
        .then(() => {
          return apiClient.get(`projects/team-projects?teamId=${team_id}`);
        })
        .then((projectsResponse) => {
          setTeamProjects(projectsResponse.data);
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
          setTeamProjects([]);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [team_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Team Banner */}
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
          <div
            className="h-32 sm:h-40 md:h-48 w-full bg-gradient-to-r from-primary/30 to-primary/10 flex items-center justify-center relative bg-cover bg-center"
            style={
              teamData?.image
                ? {
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url(${teamData.image})`,
                  }
                : {}
            }
          >
            <div className="text-center">
              {!teamData?.image && (
                <MountainIcon className="h-12 w-12 text-primary/60 mx-auto mb-2" />
              )}
              <h3
                className={`text-lg font-semibold ${
                  teamData?.image
                    ? "text-white drop-shadow-lg"
                    : "text-primary/80"
                }`}
              >
                {teamData?.name || "Team Dashboard"}
              </h3>
            </div>
          </div>
        </div>

        {/* Team Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-border/40 pl-0 md:pl-32 mt-6">
          <div>
            <div className="flex items-center mb-2">
              <Badge className="mr-2 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                Active Team
              </Badge>
              <Badge variant="outline" className="bg-background">
                {teamMembers.length} members
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mt-1">
              {teamData?.name || "Team Dashboard"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {teamData?.description ||
                "Manage your team, projects and effective collaboration"}
            </p>
          </div>
        </header>

        {/* Team Members and Leader Section */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Users className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-2xl font-bold">Team Members</h2>
          </div>

          {/* Team Members - 3 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <TeamMembers teamMembers={teamMembers} />
            </div>
          </div>

          {/* Team Leader - 1 column */}
          <div className="lg:col-span-1">
            <TeamLeader leaderData={leaderData} teamInfo={teamMembers} />
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <FolderOpen className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-2xl font-bold">Team Projects</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamProjects.map((project, index) => (
              <Card
                key={project.id || index}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      {project.name || "Untitled Project"}
                    </CardTitle>
                    <Badge
                      variant={
                        project.status === "active" ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {project.status || "Unknown"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    {project.createdAt && (
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Created{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {project.deadline && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Due: {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {project.progress !== undefined && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {teamProjects.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No projects found
                </h3>
                <p className="text-muted-foreground">
                  This team doesn't have any projects yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
