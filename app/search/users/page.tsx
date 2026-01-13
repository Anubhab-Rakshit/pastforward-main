"use client"

import Link from "next/link"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Search, UserPlus, UserCheck, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function SearchUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [following, setFollowing] = useState<Record<string, boolean>>({})
  const [isFollowLoading, setIsFollowLoading] = useState<Record<string, boolean>>({})

  const searchUsers = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!searchQuery.trim()) return

    setIsSearching(true)

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        throw new Error("Failed to search users")
      }

      const data = await response.json()
      setUsers(data.users)

      // Check following status for each user
      if (session) {
        const followingStatus: Record<string, boolean> = {}
        const loadingStatus: Record<string, boolean> = {}

        for (const user of data.users) {
          if (user.id === session.user.id) continue

          followingStatus[user.id] = false
          loadingStatus[user.id] = true

          try {
            const followResponse = await fetch(`/api/users/follow/check?userId=${user.id}`)
            if (followResponse.ok) {
              const followData = await followResponse.json()
              followingStatus[user.id] = followData.isFollowing
            }
          } catch (error) {
            console.error("Error checking follow status:", error)
          } finally {
            loadingStatus[user.id] = false
          }
        }

        setFollowing(followingStatus)
        setIsFollowLoading(loadingStatus)
      }
    } catch (error) {
      console.error("Error searching users:", error)
      toast({
        title: "Error",
        description: "Failed to search users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleFollow = async (userId: string) => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow users",
        variant: "destructive",
      })
      return
    }

    if (userId === session.user.id) {
      toast({
        title: "Error",
        description: "You cannot follow yourself",
        variant: "destructive",
      })
      return
    }

    setIsFollowLoading((prev) => ({ ...prev, [userId]: true }))

    try {
      const isFollowing = following[userId]
      const method = isFollowing ? "DELETE" : "POST"

      const response = await fetch(`/api/users/follow`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isFollowing ? "unfollow" : "follow"} user`)
      }

      setFollowing((prev) => ({ ...prev, [userId]: !isFollowing }))

      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing ? "You are no longer following this user" : "You are now following this user",
      })
    } catch (error) {
      console.error("Error following/unfollowing user:", error)
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsFollowLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Search Users</h1>
          <form onSubmit={searchUsers} className="flex gap-2">
            <Input
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              Search
            </Button>
          </form>
        </div>

        {isSearching ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user, index) => (
              <motion.div key={user.id} variants={cardVariants} custom={index} initial="hidden" animate="visible">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</div>
                        </div>
                      </div>
                      {session && user.id !== session.user.id && (
                        <Button
                          variant={following[user.id] ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleFollow(user.id)}
                          disabled={isFollowLoading[user.id]}
                        >
                          {isFollowLoading[user.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : following[user.id] ? (
                            <>
                              <UserCheck className="h-4 w-4 mr-1" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-1" />
                              Follow
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                        <div className="font-semibold">{user._count?.posts || 0}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Posts</div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                        <div className="font-semibold">{user._count?.followers || 0}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                        <div className="font-semibold">{user._count?.following || 0}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Following</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/profile/${user.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No users found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              No users match your search criteria. Try a different search term.
            </p>
            <Button onClick={() => setSearchQuery("")}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Search for users</h3>
            <p className="text-gray-500 dark:text-gray-400">Enter a name or username to find users to follow.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
