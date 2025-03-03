"use client";

import React from 'react'
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SaveBtn from './SaveBtn';

interface Props {
    title: string;
    subTitle?: string;
    workflowId: string;
}

export default function Topbar({
    title, subTitle, workflowId
}: Props) {
    const router = useRouter();
  return (
    <header className='flex p-2 border-b-2 border-separate w-full justify-between h-[60px] sticky top-0 bg-background z-10'>
        <div className='flex gap-1 flex-1'>
            <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
                <ChevronLeftIcon size={20} />
            </Button>
            <div>
                <p className='font-bold text-ellipsis truncate'>
                    {title}
                </p>
                {subTitle && (
                    <p className='text-xs text-muted-foreground truncat text-ellipsis'>
                        {subTitle}
                    </p>
                )}
            </div>
        </div>
        <div className='flex gap-1 flex-1 justify-end'>
                <SaveBtn workflowId={workflowId} />
        </div>
    </header>
  )
}
