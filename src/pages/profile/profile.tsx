import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, MapPin, Phone, Plus, Users } from 'lucide-react'
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"




export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Section */}
      <div className="bg-background border-b border-input">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg" alt="Profile picture" />
              <AvatarFallback>{user?.email.slice(0, 2).toLocaleUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                  <p className="text-gray-500">Senior Project Manager</p>
                  <div className="flex items-center gap-2 mt-1 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{user?.company}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-input hover:border-blue-600">
                    <Mail className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background border border-input h-12">
            <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
            <TabsTrigger value="projects" className="text-base">Projects</TabsTrigger>
            <TabsTrigger value="teams" className="text-base">Teams</TabsTrigger>
            <TabsTrigger value="contact" className="text-base">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-500 leading-relaxed">
                  Experienced Project Manager with over 8 years of expertise in Agile methodologies. 
                  Specialized in leading cross-functional teams and delivering high-impact software projects. 
                  Certified Scrum Master and PMP with a track record of successful project deliveries.
                </p>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Agile</Badge>
                  <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Scrum</Badge>
                  <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Kanban</Badge>
                  <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">JIRA</Badge>
                  <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Risk Management</Badge>
                  <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Team Leadership</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
                      <CalendarDays className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-gray-900 font-medium">Updated Project Roadmap</p>
                        <p className="text-gray-500 text-sm">Updated the Q3 roadmap for Project Phoenix</p>
                        <p className="text-gray-500 text-sm mt-1">2 days ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Active Projects</h2>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </div>
                <div className="grid gap-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="p-4 rounded-lg border border-input hover:border-blue-600 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">Project Phoenix</h3>
                          <p className="text-gray-500 text-sm mt-1">Enterprise Resource Planning System</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-600">In Progress</Badge>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((_, j) => (
                            <Avatar key={j} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={`/placeholder.svg`} />
                              <AvatarFallback>U{j}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="text-gray-500 text-sm">8 team members</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Teams</h2>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Users className="h-4 w-4 mr-2" />
                    Create Team
                  </Button>
                </div>
                <div className="grid gap-4">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="p-4 rounded-lg border border-input hover:border-blue-600 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">Core Development Team</h3>
                          <p className="text-gray-500 text-sm mt-1">12 members</p>
                        </div>
                        <Button variant="outline" className="border-input hover:border-blue-600">
                          View Team
                        </Button>
                      </div>
                      <div className="mt-4">
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4].map((_, j) => (
                            <Avatar key={j} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={`/placeholder.svg`} />
                              <AvatarFallback>U{j}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">john.doe@techsolutions.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-900">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

