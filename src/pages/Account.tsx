import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Page from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Cookies from "js-cookie";
import { CheckCircle2, Link as LinkIcon } from "lucide-react";
import discordIcon from "/images/icons/discord-icon.svg";

function Account() {
  const { user, role, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/users/me", {
        method: "DELETE",
        headers: { "x-xsrf-token": Cookies.get("XSRF-TOKEN") || "" },
      });
      if (!response.ok) throw new Error("Failed to delete account");
      await signOut();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConnectDiscord = () => {
    const state = btoa(
      JSON.stringify({
        intent: "connect",
        csrf: crypto.randomUUID(),
      })
    );
    sessionStorage.setItem("oauth_discord_state", state);
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_DISCORD_CONFIG_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_DISCORD_CONFIG_REDIRECT_URI,
      response_type: "code",
      scope: import.meta.env.VITE_DISCORD_CONFIG_SCOPE,
      state,
    });
    window.location.href = `https://discord.com/oauth2/authorize?${params}`;
  };

  return (
    <Page title="Account" description="Manage your profile and connected accounts.">
      <div className="flex flex-col gap-8 max-w-xl">
        {/* Profile */}
        <section className="border rounded-lg p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Profile</h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Name</span>
              <span className="font-medium">{user?.displayName || "—"}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Email</span>
              <span className="font-medium">{user?.email || "—"}</span>
              <span className="text-xs text-muted italic">You cannot change your email.</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Role</span>
              <Badge variant="default" className="w-fit">{role.toUpperCase()}</Badge>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Email verified</span>
              <span className="font-medium">{user?.emailVerified ? "Yes" : "No"}</span>
            </div>
          </div>
        </section>

        {/* Connected accounts */}
        <section className="border rounded-lg p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Connected Accounts</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={discordIcon} width={24} height={24} alt="Discord" />
              <div className="flex flex-col">
                <span className="font-medium">Discord</span>
              </div>
            </div>
            {user?.discord_uid ? (
              <div className="flex items-center gap-1.5 text-sm text-green-500 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Connected
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleConnectDiscord}
                className="flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                Connect
              </Button>
            )}
          </div>
        </section>

        {/* Danger zone */}
        <section className="border border-destructive/50 rounded-lg p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">Delete account</span>
              <span className="text-xs text-muted-foreground">Permanently delete your account and all associated data.</span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and all associated data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Yes, delete my account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </div>
    </Page>
  );
}

export default Account;
