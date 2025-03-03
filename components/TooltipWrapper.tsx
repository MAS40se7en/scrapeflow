'use client';

import React, { ReactNode } from 'react'
import { Tooltip, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';


interface Props {
    children: ReactNode;
    content: ReactNode;
    side?: "top" | "bottom" | "left" | "right"
}

export default function TooltipWrapper(props: Props) {
  return (
    <TooltipProvider delayDuration={0}>
        <Tooltip>
            <TooltipTrigger asChild>{props.children}</TooltipTrigger>
            <TooltipContent side={props.side} className='bg-white border px-2 py-1 rounded-md mb-1'>{props.content}</TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}
