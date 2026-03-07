import { createClient } from "@/lib/supabase/server";
import BannedMessage from "@/components/banned/BannedMessage";

export default async function BannedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8 text-center">Будь ласка, увійдіть</div>;
  }

  const { data: userData } = await supabase
    .from("User")
    .select("username, bannedUntil")
    .eq("id", user.id)
    .single();

  if (!userData?.bannedUntil || new Date(userData.bannedUntil) < new Date()) {
    return <div className="p-8 text-center">Ваш акаунт активний</div>;
  }

  return (
    <BannedMessage
      bannedUntil={userData.bannedUntil}
      username={userData.username}
    />
  );
}
