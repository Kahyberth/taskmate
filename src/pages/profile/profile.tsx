"use client";

import { useContext } from "react";
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
  Edit,
  AlertCircle,
  Instagram,
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
import { AuthContext } from "@/context/AuthContext";

export default function ProfilePage() {
  const { userProfile, profileLoading } = useContext(AuthContext);

  // Loading placeholder
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto py-6 space-y-8 animate-pulse">
          <div className="h-64 bg-slate-700 rounded-lg"></div>
          <div className="flex items-center space-x-4">
            <div className="h-24 w-24 rounded-full bg-slate-700"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-slate-700 rounded"></div>
              <div className="h-4 w-32 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sin datos de usuario
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>User not found.</p>
      </div>
    );
  }

  // Datos del perfil
  const profile = userProfile.profile || {};

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

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto py-6 space-y-8">
        {/* Banner y Foto de Perfil */}
        <div className="relative">
          <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gradient-to-r from-slate-800 to-indigo-900">
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
              <Avatar className="h-24 w-24 border-4 border-slate-900">
                <AvatarImage
                  src={profile.profile_picture}
                  alt={`${userProfile.name} ${userProfile.lastName}`}
                />
                <AvatarFallback className="text-xl bg-indigo-700 text-white">
                  {getInitials(userProfile.name, userProfile.lastName)}
                </AvatarFallback>
              </Avatar>
              {userProfile.isActive && (
                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-slate-900"></span>
              )}
            </div>
          </div>

          {/* Botón Editar */}
          <div className="absolute -bottom-12 right-8">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-slate-700 text-white hover:bg-slate-800"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Contenido del Perfil */}
        <div className="pt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda - Información Básica */}
          <div className="space-y-6">
            {/* Tarjeta de Información Básica */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
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
                <CardDescription className="flex items-center gap-2 text-slate-400">
                  <Building className="h-4 w-4" />
                  {userProfile.company}
                </CardDescription>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin className="h-4 w-4" />
                  {profile.location || "Location not provided"}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      userProfile.isAvailable
                        ? "bg-green-700 hover:bg-green-800"
                        : "bg-slate-600"
                    }
                  >
                    {profile.availabilityStatus || "Status not provided"}
                  </Badge>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-3 text-slate-300">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4" />
                    <span>{userProfile.phone || "Phone not provided"}</span>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

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
                                  className="text-slate-400 hover:text-white transition-colors"
                                >
                                  <Github className="h-5 w-5" />
                                </a>
                              )}
                              {links.twitter && (
                                <a
                                  href={links.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-400 hover:text-white transition-colors"
                                >
                                  <Twitter className="h-5 w-5" />
                                </a>
                              )}
                              {links.linkedin && (
                                <a
                                  href={links.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-400 hover:text-white transition-colors"
                                >
                                  <Linkedin className="h-5 w-5" />
                                </a>
                              )}
                              {links.instagram && (
                                <a
                                  href={links.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-400 hover:text-white transition-colors"
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
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.trim() !== "" ? (
                    profile.skills.split(",").map((skill, index) => (
                      <Badge key={index} className="bg-indigo-700 text-white">
                        {skill.trim()}
                      </Badge>
                    ))
                  ) : (
                    <>
                      <Badge className="bg-indigo-700 text-white">
                        Product Management
                      </Badge>
                      <Badge className="bg-indigo-700 text-white">
                        User Research
                      </Badge>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha - Tabs para Bio, Experiencia, Educación */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800 rounded-lg p-1">
                <TabsTrigger
                  value="about"
                  className="bg-transparent text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="bg-transparent text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="bg-transparent text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Education
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Bio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">
                      {profile.bio || "No bio provided"}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="mt-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-6">
                        {profile.experience
                          ? JSON.parse(profile.experience).map((exp: any) => (
                              <div
                                key={exp.id}
                                className="relative pl-6 pb-6 border-l border-slate-600"
                              >
                                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-slate-900"></div>
                                <div className="space-y-1">
                                  <h4 className="font-medium">{exp.title}</h4>
                                  <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <Building className="h-3.5 w-3.5" />
                                    {exp.company}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {exp.location}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(exp.startDate)} -{" "}
                                    {formatDate(exp.endDate)}
                                  </div>
                                  <p className="mt-2 text-sm text-slate-400">
                                    {exp.description}
                                  </p>
                                </div>
                              </div>
                            ))
                          : "No experience provided"}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="mt-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {profile.education
                        ? JSON.parse(profile.education).map((edu: any) => (
                            <div
                              key={edu.id}
                              className="relative pl-6 pb-6 border-l border-slate-600"
                            >
                              <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-slate-900"></div>
                              <div className="space-y-1">
                                <h4 className="font-medium">{edu.degree}</h4>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <GraduationCap className="h-3.5 w-3.5" />
                                  {edu.institution}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {edu.location}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {edu.startDate} - {edu.endDate}
                                </div>
                              </div>
                            </div>
                          ))
                        : "No education provided"}
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
