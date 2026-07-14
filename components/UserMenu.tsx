"use client";

import { UserButton } from '@clerk/nextjs'
import { ChartNoAxesGantt } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const UserMenu = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" aria-hidden="true" />
  }

  return <UserButton appearance={{
    elements:{
        avatarBox: "w-10 h-10",
    }
  }}>

    <UserButton.MenuItems>    
    <UserButton.Link
        label="Dashboard"
        labelIcon={<ChartNoAxesGantt size={15}/>}
        href="/dashboard"
    />
    <UserButton.Action label="manageAccount"/>
    </UserButton.MenuItems>
  </UserButton>
}

export default UserMenu