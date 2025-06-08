import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { 
  useProjectProgressStats, 
  useProjectById,
  useEpicsByProductBacklog,
} from "@/api/queries";
import { apiClient } from "@/api/client-gateway";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectProgressChartProps {
  selectedProjectId: string | null;
}

export function ProjectProgressChart({ selectedProjectId }: ProjectProgressChartProps) {
  const { user } = useContext(AuthContext);
  const [chartData, setChartData] = useState<any[]>([]);
  const [debugInfo, setDebugInfo] = useState<string>("");
  
  // For all projects mode
  const { data: projectProgressData, isLoading: isLoadingAllProjects } = useProjectProgressStats(user?.id);
  
  // For single project mode - get project details first
  const { data: projectDataRaw, isLoading: isLoadingProject } = useProjectById(selectedProjectId || undefined);
  
  // Extract the actual project from the array (backend returns array)
  const projectData = Array.isArray(projectDataRaw) ? projectDataRaw[0] : projectDataRaw;
  
  // Get backlog ID from project data
  const backlogId = selectedProjectId && projectData?.backlog?.id ? projectData.backlog.id : undefined;
  
  // Then get epics for that backlog
  const { data: epicsData, isLoading: isLoadingEpics, error: epicsError } = useEpicsByProductBacklog(backlogId);
  
  const isLoading = selectedProjectId 
    ? isLoadingProject || isLoadingEpics 
    : isLoadingAllProjects;

  // Process data based on whether a project is selected or not
  useEffect(() => {
    
    if (selectedProjectId) {
      if (!projectData) {
        setDebugInfo("Loading project data...");
        setChartData([]);
        return;
      }
      
      if (!projectData.backlog) {
        setDebugInfo(`Project: ${projectData.name} - No backlog found`);
        setChartData([]);
        return;
      }
      
      if (isLoadingEpics) {
        setDebugInfo("Loading epics...");
        setChartData([]);
        return;
      }
      
      if (epicsError) {
        setDebugInfo("Error loading epics");
        setChartData([]);
        return;
      }
      
      if (epicsData !== undefined) {
        if (epicsData.length > 0) {
          processEpicProgress();
        } else {
          setDebugInfo(`Project: ${projectData.name} - No epics found`);
          setChartData([]);
        }
      }
    } else if (!selectedProjectId && projectProgressData) {
      setChartData(projectProgressData);
      setDebugInfo("");
    } else {
      setChartData([]);
      setDebugInfo("");
    }
  }, [selectedProjectId, projectData, backlogId, epicsData, epicsError, isLoadingEpics, projectProgressData]);

  // Function to process epic progress using the backend endpoints
  const processEpicProgress = async () => {
    if (!epicsData || epicsData.length === 0) {
      setDebugInfo("No epics found for this project");
      setChartData([]);
      return;
    }
    setDebugInfo(`Processing ${epicsData.length} epics...`);

    try {
      let allProjectIssues: any[] = [];
      
      try {
        // 1. Get issues from project backlog
        try {
          const backlogResponse = await apiClient.get(`/backlog/get-backlog-by-project/${selectedProjectId}`);
          if (backlogResponse.data && backlogResponse.data.id) {
            const backlogId = backlogResponse.data.id;
            const backlogIssuesResponse = await apiClient.get(`/backlog/get-all-issues/${backlogId}`);
            
            if (backlogIssuesResponse.data && Array.isArray(backlogIssuesResponse.data)) {
              allProjectIssues = [...allProjectIssues, ...backlogIssuesResponse.data];
              console.log(`Found ${backlogIssuesResponse.data.length} issues in backlog for project ${selectedProjectId}`);
            }
          }
        } catch (error) {
          console.log(`No backlog found or error fetching backlog issues for project ${selectedProjectId}`);
        }
        
        // 2. Get issues from ALL sprints (active + completed)
        try {
          const sprintsResponse = await apiClient.get(`/sprints/get-sprints-by-project/${selectedProjectId}`);
          
          if (sprintsResponse.data && Array.isArray(sprintsResponse.data)) {
            const sprints = sprintsResponse.data;
            console.log(`Found ${sprints.length} sprints for project ${selectedProjectId}`);
            
            // For each sprint, get its issues
            for (const sprint of sprints) {
              try {
                const sprintIssuesResponse = await apiClient.get(
                  `/sprints/get-sprint-backlog-issues?sprintId=${sprint.id}`
                );
                
                if (sprintIssuesResponse.data && Array.isArray(sprintIssuesResponse.data)) {
                  allProjectIssues = [...allProjectIssues, ...sprintIssuesResponse.data];
                  console.log(`Found ${sprintIssuesResponse.data.length} issues in sprint "${sprint.name}" (${sprint.id})`);
                }
              } catch (sprintError) {
                console.log(`Error fetching issues for sprint ${sprint.id}:`, sprintError);
              }
            }
          }
        } catch (error) {
          console.log(`No sprints found or error fetching sprints for project ${selectedProjectId}`);
        }
        
        // 3. Remove duplicates based on issue ID
        const uniqueIssues = allProjectIssues.filter((issue, index, self) => 
          index === self.findIndex(i => i.id === issue.id)
        );
        
        allProjectIssues = uniqueIssues;
        console.log(`Total unique issues for project ${selectedProjectId}: ${allProjectIssues.length}`);
        
        // 4. Fallback: if no issues found, try the direct project endpoint as last resort
        if (allProjectIssues.length === 0) {
          console.log("No issues found from backlog/sprints, trying direct project endpoint as fallback...");
          try {
            const directResponse = await apiClient.get(`/issues/by-project/${selectedProjectId}`);
            allProjectIssues = directResponse.data || [];
            console.log(`Found ${allProjectIssues.length} issues from direct project endpoint`);
          } catch (error) {
            console.error("Error with direct project endpoint:", error);
          }
        }
        
        // Log issues grouped by epic
        const issuesByEpic: Record<string, any[]> = {};
        allProjectIssues.forEach(issue => {
          const epicId = issue.epic?.id || 'no-epic';
          if (!issuesByEpic[epicId]) {
            issuesByEpic[epicId] = [];
          }
          issuesByEpic[epicId].push(issue);
        });
        
        console.log("Issues grouped by epic:", Object.keys(issuesByEpic).map(epicId => ({
          epicId,
          count: issuesByEpic[epicId].length,
          issues: issuesByEpic[epicId].map((i: any) => ({ id: i.id, title: i.title, status: i.status }))
        })));
      } catch (error) {
        console.error("Error fetching all project issues:", error);
      }

      // For each epic, get its issues and calculate progress
      const epicProgressPromises = epicsData.map(async (epic: any) => {
        try {
          console.log(`Fetching issues for epic ${epic.id}:`, epic.title || epic.name);
          const response = await apiClient.get(`/issues/by-epic/${epic.id}`);
          console.log("response epicaaaaaaas", response);
          console.log("response.data:", response.data);
          console.log("response.status:", response.status);
          console.log("response.headers:", response.headers);
          const epicIssues = response.data || [];
          
          console.log(`Epic ${epic.id} has ${epicIssues.length} issues`);
          
          // Log each issue details for debugging
          epicIssues.forEach((issue: any, index: number) => {
            console.log(`Issue ${index + 1}:`, {
              id: issue.id,
              title: issue.title,
              status: issue.status,
              epic: issue.epic,
              epicId: issue.epicId
            });
          });
          
          // Compare with project issues filtered by epic
          const projectIssuesForThisEpic = allProjectIssues.filter(issue => issue.epic?.id === epic.id);
          console.log(`Comparison for epic ${epic.id}:`);
          console.log(`- From /issues/by-epic/${epic.id}: ${epicIssues.length} issues`);
          console.log(`- From /issues/by-project/${selectedProjectId} filtered: ${projectIssuesForThisEpic.length} issues`);
          
          if (epicIssues.length !== projectIssuesForThisEpic.length) {
            console.warn(`MISMATCH found for epic ${epic.id}!`);
            console.log("Issues from epic endpoint:", epicIssues.map((i: any) => ({ id: i.id, title: i.title })));
            console.log("Issues from project filtered:", projectIssuesForThisEpic.map((i: any) => ({ id: i.id, title: i.title })));
          }
          
          // Use the project filtered issues if the epic endpoint returned 0 but project has issues for this epic
          const finalIssues = epicIssues.length === 0 && projectIssuesForThisEpic.length > 0 
            ? projectIssuesForThisEpic 
            : epicIssues;
          
          console.log(`Using ${finalIssues.length} issues for epic ${epic.id} calculations`);
          
          if (finalIssues.length === 0) {
            console.log(`Epic ${epic.id} (${epic.title || epic.name}) has NO issues associated with it`);
            return {
              name: epic.title || epic.name || `Epic ${epic.id}`,
              progress: 0,
              total: 100,
              id: epic.id,
              totalIssues: 0,
              completedIssues: 0
            };
          }

          const completedIssues = finalIssues.filter(
            (issue: any) => issue.status === 'done' || issue.status === 'closed'
          ).length;

          const progress = Math.round((completedIssues / finalIssues.length) * 100);

          console.log(`Epic ${epic.id}: ${completedIssues}/${finalIssues.length} completed (${progress}%)`);

          return {
            name: epic.title || epic.name || `Epic ${epic.id}`,
            progress: progress,
            total: 100,
            id: epic.id,
            totalIssues: finalIssues.length,
            completedIssues: completedIssues
          };
        } catch (error) {
          console.error(`Error fetching issues for epic ${epic.id}:`, error);
          return {
            name: epic.title || epic.name || `Epic ${epic.id}`,
            progress: 0,
            total: 100,
            id: epic.id,
            totalIssues: 0,
            completedIssues: 0,
            error: true
          };
        }
      });

      const epicProgressData = await Promise.all(epicProgressPromises);
      
      console.log("Final epic progress data:", epicProgressData);
      
      // Sort by progress (ascending)
      const sortedData = epicProgressData.sort((a, b) => a.progress - b.progress);
      setChartData(sortedData);
      
      const totalEpics = sortedData.length;
      const epicsWithIssues = sortedData.filter(epic => epic.totalIssues > 0).length;
      setDebugInfo(`${totalEpics} epics found, ${epicsWithIssues} with issues`);
    } catch (error) {
      console.error("Error processing epic progress:", error);
      setDebugInfo("Error loading epic data");
      setChartData([]);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[250px] w-full" />;
  }

  // Show debug info in development
  const showDebugInfo = process.env.NODE_ENV === 'development' && debugInfo;

  // Show "No data available" when there's no real data
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm">
            {selectedProjectId 
              ? "This project has no epics to display" 
              : "No project progress data found"
            }
          </p>
          {showDebugInfo && (
            <p className="text-xs mt-2 text-blue-500">{debugInfo}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[250px]">
      {showDebugInfo && (
        <div className="text-xs text-blue-500 mb-2">{debugInfo}</div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" horizontal={false} />
          <XAxis type="number" stroke="var(--chart-text)" />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="var(--chart-text)" 
            width={100}
          />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: "var(--chart-tooltip-bg)",
              borderColor: "var(--chart-tooltip-border)",
              color: "var(--chart-tooltip-text)",
            }}
            labelStyle={{ color: "var(--chart-tooltip-text)" }}
            formatter={(value, props: any) => {
              if (selectedProjectId) {
                return [
                  `${value}% (${props.payload.completedIssues}/${props.payload.totalIssues} issues)`, 
                  "Epic Progress"
                ];
              }
              return [`${value}%`, "Project Progress"];
            }}
          />
          <Bar dataKey="progress" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.progress > 75
                    ? "#10b981"
                    : entry.progress > 50
                      ? "#8b5cf6"
                      : entry.progress > 25
                        ? "#f59e0b"
                        : "#ef4444"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
