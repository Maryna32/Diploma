"use client";

import { useState } from "react";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileView from "@/components/profile/ProfileView";

type Props = {
  user: any;
  logs: any[];
  likedLogs: any[];
  followers: any[];
  following: any[];
  savedLogs: any[];
};

export default function ProfilePageClient({
  user,
  logs,
  likedLogs,
  savedLogs,
  followers,
  following,
}: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <ProfileForm
        user={user}
        onClose={() => setEditing(false)}
      />
    );
  }

  return (
    <ProfileView
      user={user}
      logs={logs}
      likedLogs={likedLogs}
      followers={followers}
      following={following}
      savedLogs={savedLogs}
      currentUserId={user.id}
      isOwnProfile
      onEdit={() => setEditing(true)}
    />
  );
}