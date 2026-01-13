"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from 'lucide-react'

interface UserSearchProps {
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

export function UserSearch({ 
  placeholder = "Search users...", 
  buttonText = "Search",
  className = ""
}: UserSearchProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    router.push(`/search/users?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <form onSubmit={handleSearch} className={`flex gap-2 ${className}`}>
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Search className="h-4 w-4 mr-2" />
        )}
        {buttonText}
      </Button>
    </form>
  )
}
