"use client";

import { UpdateWorkflow } from '@/actions/workflows/updateWorkflows';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { CheckIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

export default function SaveBtn({
    workflowId
}: {
    workflowId: string
}) {
    const { toObject } = useReactFlow();

    const saveMutation = useMutation({
        mutationFn: UpdateWorkflow,
        onSuccess: () => {
            toast.success("Workflow saved", { id: "save-workflow" });
        },
        onError: () => {
            toast.error("Failed to save workflow", { id: "save-workflow" });
        }
    })
  return (
    <Button variant={"outline"} className='flex items-center gap-2'
        onClick={() => {
            const workflowDefiniton = JSON.stringify(toObject());
            toast.loading("Saving workflow...", { id: "save-workflow" });
            saveMutation.mutate({ id: workflowId, definition: workflowDefiniton });
        }}
        disabled={saveMutation.isPending}
    >
        Save
        <CheckIcon size={16} className="stroke-green-400" />
    </Button>
  )
}
