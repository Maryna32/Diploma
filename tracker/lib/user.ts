import { prisma } from "@/lib/prisma";

export async function getFollowers(userId: string) {
  return prisma.follows.findMany({
    where: { followingId: userId },
    include: { follower: true },
  });
}

export async function getFollowing(userId: string) {
  return prisma.follows.findMany({
    where: { followerId: userId },
    include: { following: true },
  });
}