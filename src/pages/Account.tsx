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
import { CheckCircle2, Link as LinkIcon, Mail, User, IdCardIcon, MailCheck } from "lucide-react";
import discordIcon from "/images/icons/discord-icon.svg";
import account from "/assets/account.png"
import { titleCase } from "title-case";
import Avatar from "boring-avatars";

function Account() {
  const { user, role, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/me`, {
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
      <div className="mx-auto max-w-4xl flex flex-col gap-4">
        <div className="justify-between flex flex-row items-center">
          <div className="flex flex-col justify-start items-start gap-2 text-pretty">
            <h2 className="font-bold text-2xl lg:text-3xl">Account</h2>
            <p>Manage your profile and connected accounts.</p>
          </div>
          <img src={account} alt="Account" height={300} width={300} className="w-40" />
        </div>

        <div className="bg-white rounded-xl p-4 gap-4 grid grid-cols-1 lg:grid-cols-5 place-items-center border border-tertiary">
          <div className="border rounded-full col-span-1 w-fit aspect-square">
            <Avatar
              size={160}
              name={user?.email}
              variant="beam"
              colors={["5079ff", "#874ffe", "#fe636a", "#ff8970", "#9ab1ff"]}
            />
          </div>

          <div className="col-span-1 lg:col-span-4 w-full p-4 flex flex-col gap-4">
            <h3 className="font-bold text-xl text-tertiary">Profile Information</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-2">
                  <div className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary w-fit aspect-square">
                    <User size={20} />
                  </div>

                  <div className="flex flex-col">
                    <p className="text-muted">NAME</p>
                    <p>{user?.displayName}</p>

                  </div>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <div className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary w-fit aspect-square">
                    <Mail size={20} />
                  </div>

                  <div className="flex flex-col">
                    <p className="text-muted">EMAIL</p>
                    <p>{user?.email}</p>

                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-2">
                  <div className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary w-fit aspect-square">
                    <IdCardIcon size={20} />
                  </div>

                  <div className="flex flex-col">
                    <p className="text-muted">ROLE</p>
                    <Badge>{titleCase(user?.role || "")}</Badge>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <div className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary w-fit aspect-square">
                    <MailCheck size={20} />
                  </div>

                  <div className="flex flex-col">
                    <p className="text-muted">EMAIL VERIFIED</p>
                    <p>{user?.emailVerified ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connected */}
        <div className="bg-white rounded-xl p-4 gap-4 flex flex-col justify-between border border-tertiary">
          <div className="col-span-1 lg:col-span-4 w-full p-4 flex flex-col gap-4">
            <h3 className="font-bold text-xl text-tertiary">Connected Accounts</h3>
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between w-full">
              <div className="flex items-center gap-3">
                <img src={discordIcon} width={24} height={24} alt="Discord" />
                <div className="flex flex-col">
                  <span className="font-medium ">Discord</span>
                </div>
              </div>
              {user?.discord_uid ? (
                <div className="flex items-center gap-1.5 text-sm text-green-500 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Connected
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleConnectDiscord}
                  className="flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  Connect
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Danger */}
        <div className="bg-white rounded-xl p-4 gap-4 flex flex-col justify-between border border-destructive">
          <div className="col-span-1 lg:col-span-4 w-full p-4 flex flex-col gap-4">
            <h3 className="font-bold text-xl text-destructive">Danger Zone</h3>
            <div className="flex flex-col w-full lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col gap-0.5 w-full">
                <span className="font-medium text-destructive">Delete account</span>
                <span className="text-xs text-muted-foreground">Permanently delete your account and all associated data.</span>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full lg:w-fit" variant="destructive" size="sm">Delete account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive">Delete account?</AlertDialogTitle>
                    <AlertDialogDescription className="text-destructive">
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
          </div>
        </div>

      </div>
    </Page>
  );
}

export default Account;
