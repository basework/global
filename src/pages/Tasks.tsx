import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Clock, Gift } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  reward: string;
  amount: number;
  status: "available" | "completed";
  link?: string;
}

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);
      loadTasks(user.id);
    };
    getUser();
  }, [navigate]);

  const loadTasks = async (uid: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("telegram_joined, whatsapp_joined, last_daily_checkin")
      .eq("id", uid)
      .single();

    if (error && error.code !== "PGRST116") console.error(error);

    const today = new Date().toDateString();
    const lastDaily = data?.last_daily_checkin ? new Date(data.last_daily_checkin).toDateString() : null;

    setTasks([
      {
        id: 1,
        title: "Join Telegram Channel",
        description: "Join our official Telegram channel for updates",
        reward: "₦5,000",
        amount: 5000,
        status: data?.telegram_joined ? "completed" : "available",
        link: "https://t.me/officialbluepay2025",
      },
      {
        id: 2,
        title: "Join WhatsApp Group",
        description: "Join our WhatsApp community for instant updates",
        reward: "₦5,000",
        amount: 5000,
        status: data?.whatsapp_joined ? "completed" : "available",
        link: "https://chat.whatsapp.com/EB6wii8cqxI25rENGOzI5d?mode=wwt",
      },
      {
        id: 3,
        title: "Complete Profile",
        description: "Fill out your profile information",
        reward: "₦2,000",
        amount: 2000,
        status: "available",
      },
      {
        id: 4,
        title: "Make First Referral",
        description: "Invite your first friend to Chixx9ja",
        reward: "₦10,000",
        amount: 10000,
        status: "available",
      },
      {
        id: 5,
        title: "Daily Check-in",
        description: "Come back every day and claim your reward!",
        reward: "₦15,000",
        amount: 15000,
        status: lastDaily === today ? "completed" : "available",
      },
    ]);
  };

  const claimInstant = async (task: Task) => {
    if (task.status === "completed") return;

    let updates: any = {
      balance: supabase.raw(`balance + ${task.amount}`),
    };

    if (task.id === 1) updates.telegram_joined = true;
    if (task.id === 2) updates.whatsapp_joined = true;
    if (task.id === 5) updates.last_daily_checkin = new Date().toISOString();

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) {
      toast.error("Failed. Try again.");
      return;
    }

    toast.success(`${task.reward} added instantly!`, { duration: 5000 });

    if (task.link) {
      window.open(task.link, "_blank", "noopener,noreferrer");
    }

    loadTasks(userId);
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
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-primary" />
            
            <div>
              <h2 className="text-xl font-bold">Earn Extra Rewards</h2>
              <p className="text-sm text-muted-foreground">
                Complete tasks to earn bonus credits and boost your earnings
              </p>
            </div>
          </div>
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
                    onClick={() => claimInstant(task)}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg text-base font-bold hover:opacity-90 transition-all min-w-[120px]"
                  >
                    Claim Now
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-semibold">Completed</span>
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