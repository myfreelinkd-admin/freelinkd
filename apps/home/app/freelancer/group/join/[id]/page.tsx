"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import InviteGroup from "../../../../components/invitation/invite-group";
import JoinConfirmationModal from "@/app/components/invitation/modals/join-modals"; 
import GroupChatModal from "../../../../components/dashboard/freelancer/contents/dashboard/modals/chat-group";

interface GroupInfo {
  id: string;
  name: string;
  icon?: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  memberCount: number;
  maxMembers: number;
}

interface Member {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  isOnline?: boolean;
}

export default function JoinGroupPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = params;

  // Check if user just logged in and should auto-join
  const autoJoin = searchParams.get("auto_join") === "true";

  const [status, setStatus] = useState<
    "loading" | "pending" | "not_logged_in"
  >("loading");
  
  const [modalStatus, setModalStatus] = useState<
    "confirming" | "joining" | "success" | "error"
  >("confirming");
  
  const [errorMessage, setErrorMessage] = useState("");
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [user, setUser] = useState<any>(null);
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  
  // Members for chat modal
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // 1. First, fetch group info (public - no auth required)
      try {
        const groupResponse = await fetch(`/api/freelancer/group/${id}`);
        const groupData = await groupResponse.json();

        if (groupData.success && groupData.data) {
          setGroupInfo(groupData.data);
        } else {
          setStatus("loading"); // Keep loading to show error in modal
          setModalStatus("error");
          setErrorMessage(groupData.error || "Group not found");
          setShowConfirmModal(true);
          return;
        }
      } catch (e) {
        setModalStatus("error");
        setErrorMessage("Failed to load group information");
        setShowConfirmModal(true);
        return;
      }

      // 2. Check if user is logged in
      const storage = localStorage.getItem("freelancer_user")
        ? localStorage
        : sessionStorage;
      const storedUser = storage.getItem("freelancer_user");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setStatus("pending");
          
          // If auto_join flag is present, automatically join the group
          if (autoJoin) {
            setShowConfirmModal(true);
            setModalStatus("joining");
            // Delay to show the modal first, then join
            setTimeout(() => {
              handleJoinGroup(parsedUser);
            }, 500);
          }
        } catch (e) {
          setStatus("not_logged_in");
        }
      } else {
        setStatus("not_logged_in");
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, autoJoin]);

  const handleJoinGroup = async (currentUser?: any) => {
    const userToUse = currentUser || user;
    if (!userToUse || !id || !groupInfo) return;
    
    setModalStatus("joining");

    try {
      const response = await fetch("/api/freelancer/group/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: id,
          freelancerId: userToUse.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setModalStatus("success");
        
        // Build members list for chat modal
        if (data.data?.members) {
          const membersList: Member[] = [];
          
          // Add owner
          if (groupInfo.ownerName) {
            membersList.push({
              id: groupInfo.ownerId,
              name: groupInfo.ownerName,
              avatar: groupInfo.ownerAvatar,
              role: "Owner",
              isOnline: true,
            });
          }
          
          // Add other members
          if (data.data.memberDetails) {
            data.data.memberDetails.forEach((m: any) => {
              membersList.push({
                id: m.id,
                name: m.name || "Member",
                avatar: m.avatar,
                role: "Member",
                isOnline: false,
              });
            });
          }
          
          setMembers(membersList);
        }
      } else {
        setModalStatus("error");
        setErrorMessage(data.error || "Failed to join group");
      }
    } catch (e) {
      setModalStatus("error");
      setErrorMessage("An unexpected error occurred");
    }
  };

  const handleAcceptClick = () => {
    if (status === "not_logged_in") {
      // Redirect to login with return URL that includes auto_join
      const returnUrl = encodeURIComponent(`/freelancer/group/join/${id}?auto_join=true`);
      router.push(`/freelancer/login?returnUrl=${returnUrl}`);
    } else {
      // Show confirmation modal
      setShowConfirmModal(true);
      setModalStatus("confirming");
    }
  };

  const handleConfirmJoin = () => {
    handleJoinGroup();
  };

  const handleCloseModal = () => {
    if (modalStatus === "success") {
      router.push("/freelancer/dashboard");
    } else if (modalStatus === "error" && !groupInfo) {
      router.push("/freelancer/dashboard");
    } else {
      setShowConfirmModal(false);
      setModalStatus("confirming");
    }
  };

  const handleOpenChat = () => {
    setShowConfirmModal(false);
    setShowChatModal(true);
  };

  const handleCloseChatAndRedirect = () => {
    setShowChatModal(false);
    router.push("/freelancer/dashboard");
  };

  const handleDecline = () => {
    if (status === "not_logged_in") {
      router.push("/");
    } else {
      router.push("/freelancer/dashboard");
    }
  };

  // Loading state
  if (status === "loading" && !showConfirmModal) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#0B1C46] animate-spin" />
          <p className="text-gray-500 font-medium">Loading invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Main Invitation Card */}
      <div className="w-full max-w-md">
        <InviteGroup
          groupName={groupInfo?.name || "Loading..."}
          inviterName={groupInfo?.ownerName || "Unknown"}
          groupImageUrl={groupInfo?.icon || ""}
          memberCount={groupInfo?.memberCount || 1}
          maxMembers={groupInfo?.maxMembers || 5}
          onAccept={handleAcceptClick}
          onDecline={handleDecline}
          status="pending"
        />
        
        {/* Login hint for not logged in users */}
        {status === "not_logged_in" && (
          <p className="text-center text-gray-500 text-sm mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            You need to login first to accept this invitation
          </p>
        )}
      </div>

      {/* Confirmation Modal */}
      <JoinConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmJoin}
        onOpenChat={modalStatus === "success" ? handleOpenChat : undefined}
        groupName={groupInfo?.name || "Group"}
        groupImageUrl={groupInfo?.icon}
        inviterName={groupInfo?.ownerName || "Unknown"}
        memberCount={groupInfo?.memberCount || 1}
        maxMembers={groupInfo?.maxMembers || 5}
        status={modalStatus}
        errorMessage={errorMessage}
      />

      {/* Group Chat Modal */}
      {groupInfo && user && (
        <GroupChatModal
          isOpen={showChatModal}
          onClose={handleCloseChatAndRedirect}
          groupId={groupInfo.id}
          userId={user.id}
          group={{
            id: groupInfo.id,
            name: groupInfo.name,
            icon: groupInfo.icon,
          }}
          members={members}
        />
      )}
    </div>
  );
}
