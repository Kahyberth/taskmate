// teamData.ts

export const teamData = {
    id: "team-1",
    name: "Desarrollo Frontend",
    description:
      "Equipo responsable del desarrollo de interfaces de usuario y experiencia de usuario",
    photo: "/placeholder.svg?height=200&width=400",
    status: "active",
    completionRate: 87,
    activeProjects: 4,
    totalTasks: 156,
    completedTasks: 124,
    leader: {
        id: "user-1",
        name: "Alex Johnson",
        role: "Lead Developer",
        email: "alex@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        avatar: "/placeholder.svg?height=100&width=100",
        status: "online",
      },
    members: [
      {
        id: "user-2",
        name: "Sarah Williams",
        role: "Senior Developer",
        email: "sarah@example.com",
        phone: "+1 (555) 234-5678",
        location: "New York, NY",
        avatar: "/placeholder.svg?height=100&width=100",
        status: "online",
        skills: ["React", "TypeScript", "Node.js", "AWS"],
        projects: ["Mobile App Redesign", "API Integration"],
        tasksCompleted: 45,
        tasksInProgress: 12,
      },
      {
        id: "user-3",
        name: "Michael Brown",
        role: "UX Designer",
        email: "michael@example.com",
        phone: "+1 (555) 345-6789",
        location: "Austin, TX",
        avatar: "/placeholder.svg?height=100&width=100",
        status: "away",
        skills: ["Figma", "UI/UX", "Prototyping", "User Research"],
        projects: ["Mobile App Redesign", "Documentation Update"],
        tasksCompleted: 38,
        tasksInProgress: 8,
      },
      {
        id: "user-4",
        name: "Emily Davis",
        role: "Frontend Developer",
        email: "emily@example.com",
        phone: "+1 (555) 456-7890",
        location: "Chicago, IL",
        avatar: "/placeholder.svg?height=100&width=100",
        status: "offline",
        skills: ["React", "CSS", "JavaScript", "Accessibility"],
        projects: ["Performance Optimization", "Mobile App Redesign"],
        tasksCompleted: 32,
        tasksInProgress: 5,
      },
      {
        id: "user-5",
        name: "David Wilson",
        role: "Backend Developer",
        email: "david@example.com",
        phone: "+1 (555) 567-8901",
        location: "Seattle, WA",
        avatar: "/placeholder.svg?height=100&width=100",
        status: "online",
        skills: ["Python", "Django", "PostgreSQL", "Docker"],
        projects: ["API Integration", "Performance Optimization"],
        tasksCompleted: 41,
        tasksInProgress: 10,
      },
      {
        id: "user-6",
        name: "Jessica Martinez",
        role: "QA Engineer",
        email: "jessica@example.com",
        phone: "+1 (555) 678-9012",
        location: "Boston, MA",
        avatar: "/placeholder.svg?height=100&width=100",
        status: "online",
        skills: ["Test Automation", "Selenium", "Jest", "Cypress"],
        projects: ["Mobile App Redesign", "Documentation Update"],
        tasksCompleted: 36,
        tasksInProgress: 7,
      },
    ],
    projects: [
      {
        id: "project-1",
        name: "Mobile App Redesign",
        description:
          "Rediseño de la interfaz de la aplicación móvil para mejorar la experiencia de usuario",
        progress: 75,
        deadline: "2023-12-15",
        priority: "high",
        tasks: {
          total: 48,
          completed: 36,
          inProgress: 8,
          pending: 4,
        },
        assignees: ["user-2", "user-3", "user-4", "user-6"],
      },
      {
        id: "project-2",
        name: "API Integration",
        description:
          "Integración de APIs de terceros para mejorar la funcionalidad",
        progress: 45,
        deadline: "2023-11-30",
        priority: "medium",
        tasks: {
          total: 32,
          completed: 14,
          inProgress: 10,
          pending: 8,
        },
        assignees: ["user-2", "user-5"],
      },
      {
        id: "project-3",
        name: "Performance Optimization",
        description: "Mejora del rendimiento y tiempos de carga de la aplicación",
        progress: 90,
        deadline: "2023-11-15",
        priority: "high",
        tasks: {
          total: 24,
          completed: 22,
          inProgress: 2,
          pending: 0,
        },
        assignees: ["user-4", "user-5"],
      },
      {
        id: "project-4",
        name: "Documentation Update",
        description:
          "Actualización de la documentación para usuarios y desarrolladores",
        progress: 30,
        deadline: "2023-12-20",
        priority: "low",
        tasks: {
          total: 18,
          completed: 5,
          inProgress: 3,
          pending: 10,
        },
        assignees: ["user-3", "user-6"],
      },
    ],
    events: [
      {
        id: "event-1",
        title: "Reunión Semanal del Equipo",
        date: "2023-11-10T10:00:00",
        duration: 60,
        location: "Sala de Conferencias A",
        attendees: ["user-1", "user-2", "user-3", "user-4", "user-5", "user-6"],
      },
      {
        id: "event-2",
        title: "Planificación de Sprint",
        date: "2023-11-12T14:00:00",
        duration: 90,
        location: "Virtual",
        attendees: ["user-1", "user-2", "user-5"],
      },
      {
        id: "event-3",
        title: "Revisión de Diseño",
        date: "2023-11-14T11:00:00",
        duration: 45,
        location: "Sala de Diseño",
        attendees: ["user-1", "user-3", "user-4"],
      },
    ],
    messages: [
      {
        id: "msg-1",
        sender: "user-1",
        content:
          "Buenos días equipo! Vamos a discutir el progreso del rediseño de la app móvil.",
        timestamp: "2023-11-09T09:00:00",
        reactions: ["👍", "👋"],
      },
      {
        id: "msg-2",
        sender: "user-2",
        content:
          "He completado el flujo de autenticación. Subiré los cambios hoy.",
        timestamp: "2023-11-09T09:05:00",
        reactions: ["🎉"],
      },
      {
        id: "msg-3",
        sender: "user-3",
        content:
          "Los nuevos mockups de UI están listos para revisión. Los he compartido en la carpeta de diseño.",
        timestamp: "2023-11-09T09:10:00",
        reactions: ["👀", "❤️"],
      },
      {
        id: "msg-4",
        sender: "user-4",
        content: "Empezaré a implementar los nuevos componentes de UI hoy.",
        timestamp: "2023-11-09T09:15:00",
        reactions: [],
      },
      {
        id: "msg-5",
        sender: "user-5",
        content:
          "Los endpoints de API para las nuevas funciones ya están disponibles en el entorno de staging.",
        timestamp: "2023-11-09T09:20:00",
        reactions: ["👍"],
      },
      {
        id: "msg-6",
        sender: "user-6",
        content:
          "He comenzado a escribir casos de prueba para las nuevas funciones. Necesitaré input del equipo de desarrollo.",
        timestamp: "2023-11-09T09:25:00",
        reactions: [],
      },
      {
        id: "msg-7",
        sender: "user-1",
        content:
          "¡Gran progreso todos! Sincronicémonos por la tarde para abordar cualquier bloqueante.",
        timestamp: "2023-11-09T09:30:00",
        reactions: ["👍", "👌"],
      },
    ],
    timeTracking: [
      {
        project: "Mobile App Redesign",
        hours: [8, 6, 7, 8, 4],
        members: { "user-2": 12, "user-3": 8, "user-4": 10 },
      },
      {
        project: "API Integration",
        hours: [4, 5, 6, 3, 2],
        members: { "user-2": 5, "user-5": 15 },
      },
      {
        project: "Performance Optimization",
        hours: [2, 3, 4, 5, 6],
        members: { "user-4": 4, "user-5": 8 },
      },
      {
        project: "Documentation Update",
        hours: [1, 2, 1, 0, 3],
        members: { "user-3": 2, "user-6": 5 },
      },
    ],
    performance: {
      velocity: [
        { sprint: "Sprint 1", points: 32 },
        { sprint: "Sprint 2", points: 38 },
        { sprint: "Sprint 3", points: 35 },
        { sprint: "Sprint 4", points: 42 },
        { sprint: "Sprint 5", points: 45 },
      ],
      burndown: [
        { day: "Día 1", remaining: 120 },
        { day: "Día 2", remaining: 110 },
        { day: "Día 3", remaining: 95 },
        { day: "Día 4", remaining: 85 },
        { day: "Día 5", remaining: 70 },
        { day: "Día 6", remaining: 65 },
        { day: "Día 7", remaining: 55 },
        { day: "Día 8", remaining: 45 },
        { day: "Día 9", remaining: 35 },
        { day: "Día 10", remaining: 20 },
      ],
      taskCompletion: [
        { week: "Semana 1", completed: 24, total: 30 },
        { week: "Semana 2", completed: 28, total: 32 },
        { week: "Semana 3", completed: 26, total: 28 },
        { week: "Semana 4", completed: 30, total: 34 },
      ],
      memberPerformance: [
        { name: "Sarah Williams", efficiency: 92, quality: 88, collaboration: 95 },
        { name: "Michael Brown", efficiency: 85, quality: 90, collaboration: 82 },
        { name: "Emily Davis", efficiency: 78, quality: 85, collaboration: 90 },
        { name: "David Wilson", efficiency: 88, quality: 82, collaboration: 85 },
        { name: "Jessica Martinez", efficiency: 90, quality: 95, collaboration: 88 },
      ],
    },
  } as const;
  
  export const weeklyHoursData = [
    { day: "Lun", hours: 45 },
    { day: "Mar", hours: 52 },
    { day: "Mié", hours: 48 },
    { day: "Jue", hours: 50 },
    { day: "Vie", hours: 40 },
  ];
  
  export const projectHoursData = [
    { name: "Mobile App Redesign", value: 33 },
    { name: "API Integration", value: 20 },
    { name: "Performance Optimization", value: 20 },
    { name: "Documentation Update", value: 7 },
  ];
  
  export const taskStatusData = [
    { name: "Completadas", value: 124 },
    { name: "En Progreso", value: 22 },
    { name: "Pendientes", value: 10 },
  ];
  
  export const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"];
  
  export const TASK_STATUS_COLORS = ["#8b5cf6", "#ec4899", "#0ea5e9"];
  