import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Tasks = () => {
  const navigate = useNavigate();

  const tasks = [
    {
      id: 1,
      title: "Join Telegram Channel",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://t.me/officialbluepay2025",
    },
    {
      id: 2,
      title: "Join WhatsApp Group",
      description: "Join our WhatsApp community for instant updates",
      reward: "₦5,000",
      link: "https://chat.whatsapp.com/EB6wii8cqxI25rENGOzI5d?mode=wwt",
    },
    {
      id: 5,
      title: "Daily Check-in",
      description: "Come back every day and claim your reward!",
      reward: "₦15,000",
    },
  ];

  const handleClaim = async (task: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let amount = 0;
    if (task.id === 1 || task.id === 2) amount = 5000;
    if (task.id === 5) amount = 15000;

    const { error } = await supabase
      .from("profiles")
      .update({ balance: supabase.raw(`balance + ${amount}`) })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed. Try again.");
    } else {
      toast.success(`${task.reward} added instantly!`);
      if (task.link) window.open(task.link, "_blank");
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

              <Button
                onClick={() => handleClaim(task)}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 px-6 py-3 font-bold"
              >
                Claim Now
              </Button>
            </div>
          </Card>
        ))}

        <Card className="bg-muted/50 border-border/50 p-4">
          <p className="text-sm text-center text-muted-foreground">
            New tasks are added regularly. Check back daily!
          </p>
        </Card>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Tasks;