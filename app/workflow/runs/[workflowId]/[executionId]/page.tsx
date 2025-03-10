import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/getWorkflowExecutionWithPhases';
import Topbar from '@/app/workflow/editor/[workflowId]/_components/topbar/Topbar';
import { Loader2Icon } from 'lucide-react';
import React, { Suspense } from 'react'

export default function ExecutionViewerPage({ params }: {
    params: {
        executionId: string;
        workflowId: string
    }
}) {
  return (
    <div className='flex flex-col h-screen w-full overflow-hidden'>
        <Topbar workflowId={params.workflowId} title="Workflow run details" subTitle={`Run ID: ${params.executionId}`} hideButtons />

        <section className='flex h-full overflow-auto'>
            <Suspense fallback={
                <div className='flex w-full items-center justify-center'>
                    <Loader2Icon className='h-10 w-10 animate-spin stroke-primary' />
                </div>
            }>
                <ExecutionViewerWrapper executionId={params.executionId} />
            </Suspense>
        </section>
    </div>
  )
}

async function ExecutionViewerWrapper({
    executionId,
}: {
    executionId: string;
}) {
    const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);

    if (!workflowExecution) {
        return <div>Workflow not found</div>
    }

    return (
        <pre>{JSON.stringify(workflowExecution, null, 4)}</pre>
    )
}
