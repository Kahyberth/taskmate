import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, MapPin, Phone, CheckCircle2, Github, Linkedin, Twitter, Globe, Pencil } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { Loader } from "@mantine/core";


export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { userProfile, profileLoading } = useContext(AuthContext);

  if (profileLoading) {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Loader color="grape" type="dots" />
          </div>
        );
      }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        No hay información disponible.
      </div>
    );
  }

  const skills = userProfile.profile.skills.split(",").filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[280px] w-full overflow-hidden bg-gradient-to-br from-primary/5 to-background">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container max-w-6xl mx-auto h-full px-4 relative">
          <div className="absolute bottom-8 flex items-end gap-6">
            <div className="relative">
              <Avatar className="w-[120px] h-[120px] border-4 border-background shadow-xl rounded-2xl">
                <AvatarImage
                  src={userProfile.profile.profile_picture}
                  alt={`${userProfile.name} ${userProfile.lastName}`}
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl">
                  {userProfile.name[0]}
                  {userProfile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-3 right-3 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-background" />
            </div>
            <div className="mb-2 space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {userProfile.name} {userProfile.lastName}
                </h1>
                {userProfile.profile.isVerified && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </div>
              <p className="text-muted-foreground">
                Senior Software Engineer at {userProfile.company}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex h-14 items-center gap-4 justify-between">
            <Tabs defaultValue="about" className="h-full w-full">
              <div className="flex justify-between items-center">
                <TabsList className="h-full bg-transparent p-0 gap-4">
                  <TabsTrigger
                    value="about"
                    className="h-full px-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none relative"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="experience"
                    className="h-full px-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none relative"
                  >
                    Experience
                  </TabsTrigger>
                  <TabsTrigger
                    value="education"
                    className="h-full px-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none relative"
                  >
                    Education
                  </TabsTrigger>
                </TabsList>
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-2">
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl w-full">
                    <DialogHeader className="pb-4">
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        // Aquí puedes agregar la lógica para actualizar los datos
                        setIsEditing(false);
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="name">First Name</Label>
                          <Input id="name" defaultValue={userProfile.name} className="h-8" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue={userProfile.lastName} className="h-8" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={userProfile.email} className="h-8" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" defaultValue={userProfile.phone} className="h-8" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input id="company" defaultValue={userProfile.company} className="h-8" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" defaultValue={userProfile.profile.location} className="h-8" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" defaultValue={userProfile.profile.bio} className="h-20" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skills">Skills (comma separated)</Label>
                        <Textarea id="skills" defaultValue={userProfile.profile.skills} className="h-20" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch id="available" defaultChecked={userProfile.isAvailable} />
                          <Label htmlFor="available">Available for hire</Label>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <Label>Social Links</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Input id="github" type="url" placeholder="GitHub" className="h-8" />
                          </div>
                          <div className="space-y-2">
                            <Input id="linkedin" type="url" placeholder="LinkedIn" className="h-8" />
                          </div>
                          <div className="space-y-2">
                            <Input id="twitter" type="url" placeholder="Twitter" className="h-8" />
                          </div>
                          <div className="space-y-2">
                            <Input id="website" type="url" placeholder="Website" className="h-8" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" size="sm">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <main className="container max-w-6xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <TabsContent value="about" className="mt-0 space-y-6">
                      <div className="prose prose-zinc dark:prose-invert max-w-none">
                        <p className="text-muted-foreground leading-relaxed">
                          {userProfile.profile.bio}
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h2 className="text-lg font-medium">Skills & Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="rounded-md px-2 py-0.5 font-normal">
                              {skill.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="experience" className="mt-0 space-y-6">
                      <div className="space-y-8">
                        <div className="flex gap-4">
                          <Avatar className="w-10 h-10 rounded-md mt-1 border">
                            <AvatarFallback>ZC</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-medium">Senior Software Engineer</h3>
                                <p className="text-sm text-muted-foreground">Zypnapcore</p>
                              </div>
                              <div className="text-sm text-muted-foreground">2023 - Present</div>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Led the development of multiple key features and mentored junior developers. Improved application performance by 40%.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="education" className="mt-0 space-y-6">
                      <div className="space-y-8">
                        <div className="flex gap-4">
                          <Avatar className="w-10 h-10 rounded-md mt-1 border">
                            <AvatarFallback>UN</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-medium">Bachelor of Science in Computer Science</h3>
                                <p className="text-sm text-muted-foreground">University of Technology</p>
                              </div>
                              <div className="text-sm text-muted-foreground">2015 - 2019</div>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Graduated with honors. Specialized in Software Engineering.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-lg font-medium">Contact & Info</h2>
                      <div className="grid gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {userProfile.email}
                        </div>
                        {userProfile.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            {userProfile.phone}
                          </div>
                        )}
                        {userProfile.profile.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {userProfile.profile.location}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className="w-4 h-4" />
                          {userProfile.company}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-lg font-medium">Social Links</h2>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="rounded-md">
                          <Github className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-md">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-md">
                          <Twitter className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-md">
                          <Globe className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
