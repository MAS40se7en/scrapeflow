'use client';

import { Workflow } from '@prisma/client'
import React from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from './FlowEditor'
import Topbar from './topbar/Topbar';
import TaskMenu from './TaskMenu';

export default function Editor({ workflow }: { workflow: Workflow }) { 
  return (
    <ReactFlowProvider>
        <div className='flex flex-col h-full overflow-hidden'>
          <Topbar title='Workflow editor' subTitle={workflow.name} workflowId={workflow.id} />
            <section className='flex h-full overflow-auto'>
              <TaskMenu />
                <FlowEditor workflow={workflow} />
            </section>
        </div>
    </ReactFlowProvider>
  )
}
