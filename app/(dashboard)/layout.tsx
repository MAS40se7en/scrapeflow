import BreadcrumbHeader from '@/components/BreadcrumbHeader'
import { AppProviders } from '@/components/providers/AppProviders'
import DesktopSidebar from '@/components/Sidebar'
import { ModeToggle } from '@/components/ThemeModeToggle'
import { Separator } from '@/components/ui/separator'
import { SignedIn, UserButton } from '@clerk/nextjs'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode}) {
  return (
    <div className='flex h-screen'>
        <DesktopSidebar />
        <div className='flex flex-col flex-1 min-h-screen'>
            <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
                <BreadcrumbHeader />
                <div className="gap-3 flex items-center">
                    <ModeToggle />
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </header>
            <Separator />
            <div className='overflow-auto'>
                <div className='flex-1 container py-4 text-accent-foreground px-10'>
                    <AppProviders>
                        {children}
                    </AppProviders>
                </div>
            </div>
        </div>
    </div>
  )
}
