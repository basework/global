import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Gift } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface TaskItem {
  id: number;
  title: string;
  description: string;
  reward: string;
  amount: number;
  done: boolean;
  link?: string;
}

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUserId(user.id);
    await loadTaskStatus(user.id);
  };

  const loadTaskStatus = async (uid: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("telegram_joined, whatsapp_joined, last_daily_checkin")
      .eq("id", uid)
      .single();

    if (error && error.code !== "PGRST116") {
      toast.error("Failed to load tasks");
      return;
    }

    const today = new Date().toDateString();
    const lastDaily = data?.last_daily_checkin ? new Date(data.last_daily_checkin).toDateString() : null;

    setTasks([
      {
        id: 1,
        title: "Join Telegram Channel",
        description: "Join our official Telegram channel for updates",
        reward: "₦5,000",
        amount: 5000,
        done: data?.telegram_joined || false,
        link: "https://t.me/officialbluepay2025",
      },
      {
        id: 2,
        title: "Join WhatsApp Group",
        description: "Join our WhatsApp community for instant updates",
        reward: "₦5,000",
        amount: 5000,
        done: data?.whatsapp_joined || false,
        link: "https://chat.whatsapp.com/EB6wii8cqxI25rENGOzI5d?mode=wwt",
      },
      {
        id: 5,
        title: "Daily Check-in",
        description: "Come back every day and claim your reward!",
        reward: "₦15,000",
        amount: 15000,
        done: lastDaily === today,
      },
    ]);
  };

  const claimReward = async (task: TaskItem) => {
    if (task.done || isClaiming || !userId) return;

    setIsClaiming(true);

    let updateFields: any = {
      balance: supabase.raw(`balance + ${task.amount}`),
    };

    // Mark task as completed
    if (task.id === 1) updateFields.telegram_joined = true;
    if (task.id === 2) updateFields.whatsapp_joined = true;
    if (task.id === 5) updateFields.last_daily_checkin = new Date().toISOString();

    const { error } = await supabase
      .from("profiles")
      .update(updateFields)
      .eq("id", userId);

    if (error) {
      console.error("Claim error:", error);
      toast.error("Claim failed. Try again.");
      setIsClaiming(false);
      return;
    }

    // Success!
    toast.success(`${task.reward} added to your wallet instantly!`, {
      icon: "Money",
      duration: 4000,
    });

    // Open link AFTER payment (optional for user)
    if (task.link) {
      window.open(task.link, "_blank", "noopener,noreferrer");
    }

    // Refresh tasks
    await loadTaskStatus(userId);
    setIsClaiming(false);
  };

  return (
    <div className="min-h-screen liquid-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">Instant Tasks & Rewards</h1>
        </div>
      </div>

      <div className="p-6 space-y-5">

        {/* Hero Card */}
        <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-0 text-white p-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <Gift className="w-10 h-10" />
            <div>
              <h2 className="text-2xl font-bold">Click = Get Paid</h2>
              <p className="text-white/90">No verification • Instant payout • Every click pays</p>
            </div>
          </div>
        </Card>

        {/* Task List */}
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="bg-card/90 backdrop-blur border-border/50 p-5 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">{task.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-2xl font-black text-green-500">{task.reward}</span>
                  <span className="text-sm text-muted-foreground">instant reward</span>
                </div>
              </div>

              <div className="ml-4">
                {task.done ? (
                  <div className="flex flex-col items-center text-green-500">
                    <CheckCircle2 className="w-10 h-10 mb-1" />
                    <span className="font-bold text-lg">Completed</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => claimReward(task)}
                    disabled={isClaiming}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg px-10 py-6 shadow-xl"
                  >
                    {isClaiming ? "Paying..." : `Claim ${task.reward}`}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {/* Footer Note */}
        <Card className="bg-muted/50 border-border/30 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            All rewards are paid <span className="font-bold text-green-500">INSTANTLY</span> • No waiting • Daily check-in resets every 24 hours
          </p>
        </Card>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Tasks;