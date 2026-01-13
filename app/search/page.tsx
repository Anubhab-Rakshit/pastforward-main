"use client"

import { UserSearch } from "@/components/user-search"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Users, Hash } from 'lucide-react'
import Link from "next/link"
import { motion } from "framer-motion"

export default function SearchPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Search</h1>
        
        <div className="mb-8">
          <UserSearch 
            placeholder="Search for users by name or username..." 
            buttonText="Find Users"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/search/users">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <Users className="h-12 w-12 text-instagram-blue mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Users</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Find and follow other time travelers
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/search/posts">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <Hash className="h-12 w-12 text-instagram-pink2 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Posts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Search for historical posts by content or hashtags
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/search/eras">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <User className="h-12 w-12 text-instagram-red mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Historical Eras</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Explore posts from different time periods
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
