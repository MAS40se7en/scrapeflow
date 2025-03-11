import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";

export async function ExecuteWorkflow(executionId: string) {
    const execution = await prisma.workflowExecution.findUnique({
        where: {
            id: executionId,
        },
        include: {
            workflow: true,
            phases: true,
        }
    });

    if (!execution) {
        throw new Error("Execution not found");
    }

    // TODO: setup workflow environment

    // TODO: initialize workflow execution

    // TODO: intialize phases status

    let executionFailed = false;
    for (const phase of execution.phases) {
        // TODO: execute phase
    }

    // TODO: finalize execution

    // TODO: clean up environment

    revalidatePath("/workflow/runs")
}