"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Users, CheckCircle, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function JoinGroupPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [status, setStatus] = useState<"loading" | "ready" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [groupInfo, setGroupInfo] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Get current user
    const storage = localStorage.getItem("freelancer_user") ? localStorage : sessionStorage;
    const storedUser = storage.getItem("freelancer_user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
        // Redirect to login if not logged in, passing return URL
        // slightly separate flow, strictly redirecting for now
        router.push(`/auth/login?returnUrl=/freelancer/group/join/${id}`);
        return;
    }

    // 2. Fetch Group Info (Preview)
    // We can reuse the group fetch API, assuming it allows fetching by ID or we just try to join directly.
    // For better UX, let's fetch group details first. Using the existing GET /api/freelancer/group is tricky as it fetches BY freelancerId.
    // We might need a GET /api/freelancer/group/[id] or similar.
    // NOTE: Since we didn't make a "Get Group By ID" public endpoint, let's just use the Join action logic for specific error checking or blindly trust the UI.
    // However, showing the group name is nice. 
    // Let's implement a quick client-side fetch if possible, otherwise we skip to "Ready to Join".
    // For now, let's simulates a fetch or just proceed to "Ready".
    
    // Actually, asking to join blindly is bad. Let's assume we proceed to "Ready" state immediately if logged in.
    setStatus("ready");

  }, [id, router]);

  const handleJoin = async () => {
    if (!user || !id) return;
    setStatus("loading");

    try {
        const response = await fetch("/api/freelancer/group/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                groupId: id,
                freelancerId: user.id
            })
        });

        const data = await response.json();

        if (data.success) {
            setStatus("success");
            // Redirect after delay
            setTimeout(() => {
                router.push("/freelancer/dashboard");
            }, 2000);
        } else {
            setStatus("error");
            setErrorMessage(data.error || "Failed to join group");
        }
    } catch (e) {
        setStatus("error");
        setErrorMessage("An unexpected error occurred");
    }
  };

  if (status === "loading") {
      return (
          <div className="flex h-screen w-screen items-center justify-center bg-gray-50 flex-col gap-4">
              <Loader2 className="w-10 h-10 text-(--primary) animate-spin" />
              <p className="text-gray-500 font-medium">Checking invitation...</p>
          </div>
      );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center">
            
            {status === "ready" && (
                <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2">
                        <Users className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-(--primary) mb-2">Join Group</h1>
                        <p className="text-gray-500">
                            You have been invited to join a freelancer group. 
                            Collaborate, chat, and manage projects together.
                        </p>
                    </div>

                    <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-2">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">INVITATION CODE</p>
                        <code className="text-sm font-mono bg-white px-3 py-1 rounded border border-gray-200 text-gray-600">
                            {Array.isArray(id) ? id[0] : id}
                        </code>
                    </div>

                    <div className="flex flex-col w-full gap-3 mt-4">
                        <button 
                            onClick={handleJoin}
                            className="w-full py-3.5 bg-(--secondary) text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Accept Invite
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <Link 
                            href="/freelancer/dashboard"
                            className="w-full py-3.5 bg-white text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            )}

            {status === "success" && (
                <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-green-600 mb-2">Joined Successfully!</h1>
                        <p className="text-gray-500">
                            You are now a member of the group. Redirecting to your dashboard...
                        </p>
                    </div>
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin mt-4" />
                </div>
            )}

            {status === "error" && (
                <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-red-600 mb-2">Unable to Join</h1>
                        <p className="text-gray-500 mb-4">
                            {errorMessage}
                        </p>
                    </div>
                     <Link 
                            href="/freelancer/dashboard"
                            className="w-full py-3.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            )}

        </div>
    </div>
  );
}
