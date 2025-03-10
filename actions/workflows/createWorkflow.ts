'use server';

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflows";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";

export async function CreateWorkflow(form: createWorkflowSchemaType) {
    const { success, data } = createWorkflowSchema.safeParse(form);

    if (!success) {
        throw new Error("Invalid form data");
    }

    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthenticated");
    }

    const initialFlow: { nodes: AppNode[], edges: Edge[]} = {
        nodes: [],
        edges: []
    };

    //add flow entry point
    initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: JSON.stringify(initialFlow),
            ...data,
        }
    });

    console.log(result)

    return { success: true, redirectUrl: `/workflow/editor/${result.id}` };
}