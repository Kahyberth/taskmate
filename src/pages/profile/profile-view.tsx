import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  GraduationCap,
  Twitter,
  Linkedin,
  Github,
  CheckCircle,
  AlertCircle,
  Instagram,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "react-router-dom";
import { apiClient } from "@/api/client-gateway";

export default function ProfileViewPage() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setProfileLoading(true);
      apiClient.get(`/auth/profile/${id}`)
        .then(res => setProfileData(res.data))
        .catch(() => setProfileData(null))
        .finally(() => setProfileLoading(false));
    }
  }, [id]);

  // Loading placeholder
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
        <div className="container mx-auto py-6 space-y-8 animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="flex items-center space-x-4">
            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-slate-700"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 dark:bg-slate-700 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sin datos de usuario
  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white flex items-center justify-center">
        <p>User not found.</p>
      </div>
    );
  }

  // Datos del perfil
  const userProfile = profileData || {};
  const profile = userProfile && userProfile.profile ? userProfile.profile : {};

  // Funciones auxiliares
  const formatDate = (dateString: string) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name: string, lastName: string) => {
    return `${name?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica para seguir/dejar de seguir al usuario
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="container mx-auto py-6 space-y-8">
        {/* Banner y Foto de Perfil */}
        <div className="relative">
          <div className="relative h-96 w-full rounded-lg overflow-hidden bg-gradient-to-r from-gray-200 to-blue-300 dark:from-slate-800 dark:to-indigo-900">
            {profile.profile_banner && profile.profile_banner.trim() !== "" ? (
              <img
                src={profile.profile_banner}
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="https://cdn.pixabay.com/photo/2025/01/09/13/56/cat-9321685_1280.jpg"
                alt="Default Banner"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Foto de Perfil */}
          <div className="absolute -bottom-12 left-8 flex items-end">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-gray-50 dark:border-slate-900">
                <AvatarImage
                  src={profile.profile_picture}
                  alt={`${userProfile.name} ${userProfile.lastName}`}
                />
                <AvatarFallback className="text-xl bg-indigo-600 dark:bg-indigo-700 text-white">
                  {getInitials(userProfile.name, userProfile.lastName)}
                </AvatarFallback>
              </Avatar>
              {userProfile.isActive && (
                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-gray-50 dark:border-slate-900"></span>
              )}
            </div>
          </div>

          {/* Botón Seguir */}
          <div className="absolute -bottom-12 right-8">
            <Button
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              className={`flex items-center gap-2 ${
                isFollowing
                  ? "border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } transition-colors`}
              onClick={handleFollow}
              disabled={isLoading}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="h-4 w-4" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Follow
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Contenido del Perfil */}
        <div className="pt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda - Información Básica */}
          <div className="space-y-6">
            {/* Tarjeta de Información Básica */}
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-none transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
                  <span>
                    {userProfile.name} {userProfile.lastName}
                  </span>
                  <div className="flex items-center gap-2">
                    {profile.isVerified && (
                      <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                    {profile.isBlocked && (
                      <Badge className="bg-red-600 text-white flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Blocked
                      </Badge>
                    )}
                  </div>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                  <Building className="h-4 w-4" />
                  {userProfile.company}
                </CardDescription>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <MapPin className="h-4 w-4" />
                  {profile.location || "Location not provided"}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      userProfile.isAvailable
                        ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                        : "bg-gray-500 dark:bg-slate-600 text-white"
                    }
                  >
                    {profile.availabilityStatus || "Status not provided"}
                  </Badge>
                </div>

                <Separator className="bg-gray-200 dark:bg-slate-700" />

                <div className="space-y-3 text-gray-700 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4" />
                    <span>{userProfile.phone || "Phone not provided"}</span>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-slate-700" />

                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    {profile.social_links &&
                      (() => {
                        try {
                          const links = JSON.parse(profile.social_links);
                          return (
                            <>
                              {links.github && (
                                <a
                                  href={links.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                                >
                                  <Github className="h-5 w-5" />
                                </a>
                              )}
                              {links.twitter && (
                                <a
                                  href={links.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                                >
                                  <Twitter className="h-5 w-5" />
                                </a>
                              )}
                              {links.linkedin && (
                                <a
                                  href={links.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                                >
                                  <Linkedin className="h-5 w-5" />
                                </a>
                              )}
                              {links.instagram && (
                                <a
                                  href={links.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                                >
                                  <Instagram className="h-5 w-5" />
                                </a>
                              )}
                            </>
                          );
                        } catch (error) {
                          return null;
                        }
                      })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tarjeta de Skills */}
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-none transition-colors">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(profile.skills) && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: any, index: any) => (
                      <Badge key={index} className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha - Tabs para Bio, Experiencia, Educación */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-slate-800 rounded-lg p-1 transition-colors">
                <TabsTrigger
                  value="about"
                  className="bg-transparent text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white transition-colors"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="bg-transparent text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white transition-colors"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="bg-transparent text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white transition-colors"
                >
                  Education
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-4">
                <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-none transition-colors">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Bio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-slate-300">
                      {profile.bio || "No bio provided"}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="mt-4">
                <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-none transition-colors">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Work Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-6">
                        {profile.experience
                          ? JSON.parse(profile.experience).map((exp: any) => (
                              <div
                                key={exp.id}
                                className="relative pl-6 pb-6 border-l border-gray-300 dark:border-slate-600"
                              >
                                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-gray-50 dark:bg-slate-900"></div>
                                <div className="space-y-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white">{exp.title}</h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                    <Building className="h-3.5 w-3.5" />
                                    {exp.company}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {exp.location}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(exp.startDate)} -{" "}
                                    {formatDate(exp.endDate)}
                                  </div>
                                  <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                                    {exp.description}
                                  </p>
                                </div>
                              </div>
                            ))
                          : <p className="text-gray-600 dark:text-slate-400">No experience provided</p>}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="mt-4">
                <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-none transition-colors">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {profile.education
                        ? JSON.parse(profile.education).map((edu: any) => (
                            <div
                              key={edu.id}
                              className="relative pl-6 pb-6 border-l border-gray-300 dark:border-slate-600"
                            >
                              <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-gray-50 dark:bg-slate-900"></div>
                              <div className="space-y-1 dark:text-slate-400">
                                <h4 className="font-medium text-gray-900 dark:text-white">{edu.degree}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <GraduationCap className="h-3.5 w-3.5" />
                                  {edu.institution}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {edu.location}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {edu.startDate} - {edu.endDate}
                                </div>
                              </div>
                            </div>
                          ))
                        : <p className="text-gray-600">No education provided</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 