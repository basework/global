import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { toast } from "sonner";

const Tasks = () => {
  const navigate = useNavigate();

  const tasks = [
    {
      id: 1,
      title: "Join Telegram Channel",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      status: "available",
      link: "https://t.me/officialbluepay2025",
    },
    {
      id: 2,
      title: "Join WhatsApp Group",
      description: "Join our WhatsApp community for instant updates",
      reward: "₦5,000",
      status: "available",
      link: "https://chat.whatsapp.com/EB6wii8cqxI25rENGOzI5d?mode=wwt",
    },
    {
      id: 3,
      title: "Complete Profile",
      description: "Fill out your profile information",
      reward: "₦2,000",
      status: "available",
    },
    {
      id: 4,
      title: "Make First Referral",
      description: "Invite your first friend to Chixx9ja",
      reward: "₦10,000",
      status: "available",
    },
    {
      id: 5,
      title: "Daily Check-in",
      description: "Login daily for 7 consecutive days",
      reward: "₦15,000",
      status: "pending",
    },
  ];

  const handleTaskClick = (task: typeof tasks[0]) => {
    if (task.link && task.status === "available") {
      window.open(task.link, "_blank", "noopener,noreferrer");
      toast.success("Task started! Complete it to earn your reward.");
    }
  };

  return (
    <div className="min-h-screen liquid-bg pb-20">
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-background/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Daily Tasks</h1>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-lg border-border/50 p-6">
          <h2 className="text-xl font-bold mb-2">Earn Extra Rewards</h2>
          <p className="text-sm text-muted-foreground">
            Complete tasks to earn bonus credits and boost your earnings
          </p>
        </Card>

        {tasks.map((task) => (
          <Card key={task.id} className="bg-card/80 backdrop-blur-lg border-border/50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{task.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">{task.reward}</span>
                  <span className="text-xs text-muted-foreground">reward</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                {task.status === "available" ? (
                  <button
                    onClick={() => handleTaskClick(task)}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-all touch-manipulation min-h-[36px]"
                  >
                    Start
                  </button>
                ) : task.status === "pending" ? (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Pending</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-green-500">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs">Done</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        <Card className="bg-muted/50 border-border/50 p-4">
          <p className="text-sm text-center text-muted-foreground">
            New tasks are added regularly. Check back daily for more opportunities!
          </p>
        </Card>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Tasks;
