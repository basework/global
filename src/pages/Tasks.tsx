import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Gift } from "lucide-react";
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
    const { data } = await supabase
      .from("profiles")
      .select("telegram_joined, whatsapp_joined, last_daily_checkin")
      .eq("id", uid)
      .single()
      .catch(() => ({ data: {} }));

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

    let updates: any = { balance: supabase.raw(`balance + ${task.amount}`) };
    if (task.id === 1) updates.telegram_joined = true;
    if (task.id === 2) updates.whatsapp_joined = true;
    if (task.id === 5) updates.last_daily_checkin = new Date().toISOString();

    const { error } = await supabase.from("profiles").update(updates).eq("id", userId);

    if (error) {
      toast.error("Failed. Try again.");
      return;
    }

    toast.success(`${task.reward} added instantly!`, { duration: 4000 });
    if (task.link) window.open(task.link, "_blank");
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
                  <span className="text-lg font-bold text-primary">{task.reward}</span>
                  <span className="text-xs text-muted-foreground">instant reward</span>
                </div>
              </div>

              {task.status === "available" ? (
                <Button
                  onClick={() => claimInstant(task)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-lg"
                >
                  Claim Now
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-semibold">Completed</span>
                </div>
              )}
            </div>
          </Card>
        ))}

        <Card className="bg-muted/50 border-border/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            All rewards paid instantly • Daily check-in resets every 24 hours
          </p>
        </Card>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Tasks;