import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileImageUpload } from "@/components/profile/ProfileImageUpload";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notifications } from "@mantine/notifications";

interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
}

export function ProfileEditModal({ open, onOpenChange }: ProfileEditModalProps) {
  const { userProfile, user, updateProfile } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "experience" | "education">("basic");
  
  const [profilePicture, setProfilePicture] = useState<string | null>(
    userProfile?.profile?.profile_picture || null
  );
  const [profileBanner, setProfileBanner] = useState<string | null>(
    userProfile?.profile?.profile_banner || null
  );
  
  const initialExperience = userProfile?.profile?.experience 
    ? JSON.parse(userProfile.profile.experience) 
    : [];
  
  const initialEducation = userProfile?.profile?.education
    ? JSON.parse(userProfile.profile.education)
    : [];
  
  const [formData, setFormData] = useState({
    bio: userProfile?.profile?.bio || "",
    location: userProfile?.profile?.location || "",
    skills: userProfile?.profile?.skills || "",
    phone: userProfile?.phone || "",
    company: userProfile?.company || "",
    social_links: userProfile?.profile?.social_links
      ? JSON.parse(userProfile.profile.social_links)
      : {
          github: "",
          twitter: "",
          linkedin: "",
          instagram: "",
        },
  });

  const [experience, setExperience] = useState<ExperienceItem[]>(initialExperience);
  const [education, setEducation] = useState<EducationItem[]>(initialEducation);
  
  const [newExperience, setNewExperience] = useState<ExperienceItem>({
    id: uuidv4(),
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [newEducation, setNewEducation] = useState<EducationItem>({
    id: uuidv4(),
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value,
      },
    }));
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({ ...prev, [name]: value }));
  };

  const addExperience = () => {
    if (!newExperience.title || !newExperience.company) {
      notifications.show({
        title: "Error",
        message: "Title and company are required",
        color: "red",
      });
      return;
    }

    setExperience((prev) => [...prev, { ...newExperience, id: uuidv4() }]);
    setNewExperience({
      id: uuidv4(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const removeExperience = (id: string) => {
    setExperience((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({ ...prev, [name]: value }));
  };

  const addEducation = () => {
    if (!newEducation.degree || !newEducation.institution) {
      notifications.show({
        title: "Error",
        message: "Degree and institution are required",
        color: "red",
      });
      return;
    }

    setEducation((prev) => [...prev, { ...newEducation, id: uuidv4() }]);
    setNewEducation({
      id: uuidv4(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
    });
  };

  const removeEducation = (id: string) => {
    setEducation((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "experience" && newExperience.title && newExperience.company) {
      const shouldAdd = window.confirm("You have unsaved experience data. Would you like to add it before saving?");
      if (shouldAdd) {
        addExperience();
      }
    }
    
    if (activeTab === "education" && newEducation.degree && newEducation.institution) {
      const shouldAdd = window.confirm("You have unsaved education data. Would you like to add it before saving?");
      if (shouldAdd) {
        addEducation();
      }
    }
    
    setIsLoading(true);

    try {
      const result = await updateProfile({
        userId: user?.id,
        bio: formData.bio,
        location: formData.location,
        skills: formData.skills,
        phone: formData.phone,
        company: formData.company,
        social_links: JSON.stringify(formData.social_links),
        profile_picture: profilePicture,
        profile_banner: profileBanner,
        experience: JSON.stringify(experience),
        education: JSON.stringify(education),
      });

      if (result.success) {
        notifications.show({  
          title: "Success",
          message: "Profile updated successfully",
          color: "green",
        });
        onOpenChange(false);
      } else {
        notifications.show({
          title: "Error",
          message: result.error || "Failed to update profile",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update profile",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information below
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-2 border-b pb-2 mb-4">
          <Button
            variant={activeTab === "basic" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </Button>
          <Button
            variant={activeTab === "experience" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("experience")}
          >
            Experience
          </Button>
          <Button
            variant={activeTab === "education" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("education")}
          >
            Education
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 py-4" noValidate>
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div>
                <Label>Profile Banner</Label>
                <div className="mt-1">
                  <ProfileImageUpload
                    currentImage={profileBanner || undefined}
                    onImageChange={(image) => setProfileBanner(image)}
                    type="profile-banner"
                  />
                </div>
              </div>

              <div>
                <Label>Profile Picture</Label>
                <div className="mt-1">
                  <ProfileImageUpload
                    currentImage={profilePicture || undefined}
                    onImageChange={(image) => setProfilePicture(image)}
                    type="profile-picture"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="e.g. Google"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="e.g. +57 123 456 7890"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="e.g. New York, USA"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <Input
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="e.g. React, TypeScript, Node.js (comma separated)"
                    />
                  </div>
                </div>
              </div>



              <div className="space-y-2">
                <Label>Social Links</Label>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="github" className="text-xs">GitHub</Label>
                    <Input
                      id="github"
                      name="github"
                      value={formData.social_links.github}
                      onChange={handleSocialLinkChange}
                      className="mt-1"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="twitter" className="text-xs">Twitter</Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      value={formData.social_links.twitter}
                      onChange={handleSocialLinkChange}
                      className="mt-1"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="linkedin" className="text-xs">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={formData.social_links.linkedin}
                      onChange={handleSocialLinkChange}
                      className="mt-1"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="instagram" className="text-xs">Instagram</Label>
                    <Input
                      id="instagram"
                      name="instagram"
                      value={formData.social_links.instagram}
                      onChange={handleSocialLinkChange}
                      className="mt-1"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                </div>
              </div>
            
            
            </div>
          )}

          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-md text-sm">
                <p className="text-blue-700 dark:text-blue-400">
                  Fill in the form and click "Add Experience" to create a new entry. When you're ready, click "Save Changes" to update your profile.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add Work Experience</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="title">Job Title*</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newExperience.title}
                      onChange={handleExperienceChange}
                      placeholder="e.g. Software Engineer"
                      required={false}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company*</Label>
                    <Input
                      id="company"
                      name="company"
                      value={newExperience.company}
                      onChange={handleExperienceChange}
                      placeholder="e.g. Google"
                      required={false}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={newExperience.location}
                      onChange={handleExperienceChange}
                      placeholder="e.g. Remote, New York"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="month"
                      value={newExperience.startDate}
                      onChange={handleExperienceChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="month"
                      value={newExperience.endDate}
                      onChange={handleExperienceChange}
                      placeholder="Leave empty for present"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newExperience.description}
                    onChange={handleExperienceChange}
                    placeholder="Describe your responsibilities and achievements"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={addExperience}
                    size="sm"
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Experience
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Current Experience</h3>
                {experience.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No experience added yet.</p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-emerald-600 dark:text-emerald-500 font-medium flex items-center">
                      <span className="inline-block w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full mr-2"></span>
                      {experience.length} {experience.length === 1 ? "entry" : "entries"} ready to be saved
                    </p>
                    {experience.map((item) => (
                      <Card key={item.id} className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeExperience(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base flex items-center justify-between">
                            <span>{item.title}</span>
                            <Badge variant="outline" className="ml-2">
                              {item.startDate} - {item.endDate || "Present"}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 space-y-1 text-sm">
                          <p className="font-medium">{item.company}</p>
                          {item.location && <p className="text-muted-foreground">{item.location}</p>}
                          {item.description && <p className="mt-2">{item.description}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="space-y-6">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-md text-sm">
                <p className="text-blue-700 dark:text-blue-400">
                  Fill in the form and click "Add Education" to create a new entry. When you're ready, click "Save Changes" to update your profile.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add Education</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="degree">Degree/Certificate*</Label>
                    <Input
                      id="degree"
                      name="degree"
                      value={newEducation.degree}
                      onChange={handleEducationChange}
                      placeholder="e.g. Bachelor of Science in Computer Science"
                      required={false}
                    />
                  </div>
                  <div>
                    <Label htmlFor="institution">Institution*</Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={newEducation.institution}
                      onChange={handleEducationChange}
                      placeholder="e.g. Harvard University"
                      required={false}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={newEducation.location}
                      onChange={handleEducationChange}
                      placeholder="e.g. Cambridge, MA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="month"
                      value={newEducation.startDate}
                      onChange={handleEducationChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="month"
                      value={newEducation.endDate}
                      onChange={handleEducationChange}
                      placeholder="Leave empty for present"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={addEducation}
                    size="sm"
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Education
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Current Education</h3>
                {education.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No education added yet.</p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-emerald-600 dark:text-emerald-500 font-medium flex items-center">
                      <span className="inline-block w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full mr-2"></span>
                      {education.length} {education.length === 1 ? "entry" : "entries"} ready to be saved
                    </p>
                    {education.map((item) => (
                      <Card key={item.id} className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeEducation(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base flex items-center justify-between">
                            <span>{item.degree}</span>
                            <Badge variant="outline" className="ml-2">
                              {item.startDate} - {item.endDate || "Present"}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 space-y-1 text-sm">
                          <p className="font-medium">{item.institution}</p>
                          {item.location && <p className="text-muted-foreground">{item.location}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t sticky bottom-0 bg-white dark:bg-slate-900 pb-2 mt-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 