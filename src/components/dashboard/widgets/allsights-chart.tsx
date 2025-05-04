import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Users, AlertCircle, Clock, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { aiInsights } from "@/data/dashboard-data";


interface AIIsight {
  size: string;
  isLoading: boolean;
  onChangeSize: (size: string) => void;
  onRemove: () => void;
  widgetType: string;  
  label: string;
  setShowAIAssistant: (show: boolean) => void;
}

export function AIIsightsWidget({
  size,
  isLoading,
  onChangeSize,
  onRemove,
  setShowAIAssistant,
}: AIIsight) {

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "productivity":
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case "workflow":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "risk":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "time":
        return <Clock className="h-5 w-5 text-green-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <Card
      className={`${size} relative bg-gradient-to-br from-indigo-600/80 via-black/20 to-purple-600/80 dark:from-indigo-900/80 dark:via-black/50 dark:to-purple-900/80 border-white/20 overflow-hidden`}
    >
      <div className="absolute inset-0 wave-overlay wave-overlay-1 pointer-events-none"></div>
      <div className="absolute inset-0 wave-overlay wave-overlay-2 pointer-events-none"></div>

      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center ">
          <Sparkles className="mr-2 h-4 w-4 text-purple-300 " />
          AI Insights
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8  hover:text-white"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onChangeSize("small")}
            >
              Small
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onChangeSize("medium")}
            >
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onChangeSize("large")}
            >
              Large
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onRemove}>
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="relative">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-[20px] w-full bg-white/5" />
            <Skeleton className="h-[20px] w-full bg-white/5" />
            <Skeleton className="h-[20px] w-full bg-white/5" />
          </div>
        ) : (
          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div>
                  <p className="text-sm">{insight.insight}</p>
                  <Badge
                    variant="outline"
                    className="mt-2 text-xs border-white/10"
                  >
                    {insight.type.charAt(0).toUpperCase() +
                      insight.type.slice(1)}{" "}
                    Insight
                  </Badge>
                </div>
              </div>
            ))}

            {/* Botón para abrir el AIAssistantDialog */}
            <Button
              className="w-full bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setShowAIAssistant(true)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Open AI Assistant
            </Button>
          </div>
        )}
      </CardContent>

      {/* Estilos para la animación de ondas intensificada */}
      <style>{`
      @keyframes wave1 {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      @keyframes wave2 {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
      .wave-overlay {
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.35),
          transparent
        );
        filter: blur(3px);
      }
      .wave-overlay-1 {
        opacity: 0.6;
        animation: wave1 4s linear infinite;
      }
      .wave-overlay-2 {
        opacity: 0.5;
        animation: wave2 8s linear infinite;
      }
    `}</style>
    </Card>
  );
}
