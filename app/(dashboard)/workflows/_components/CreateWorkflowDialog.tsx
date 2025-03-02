'use client'

import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Layers2Icon } from 'lucide-react';
import React, { useState } from 'react'

export default function CreateWorkflowDialog({triggerText}: {triggerText?: string}) {
    const [isOpen, setOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button>{triggerText ?? "Create workflow"}</Button>
        </DialogTrigger>
        <DialogContent className='px-0'>
            <CustomDialogHeader
                icon={Layers2Icon}
                title="Create Workflow"
                subTitle="Start working on your workflow"
            />
        </DialogContent>
    </Dialog>
  )
}
