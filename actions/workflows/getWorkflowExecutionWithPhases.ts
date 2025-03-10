import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowExecutionWithPhases(executionId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthenticated");
    }

    return prisma.workflowExecution.findUniqueOrThrow({
        where: {
            id: executionId,
            userId,
        },
        include: {
            phases: {
                orderBy: {
                    number: "asc"
                }
            }
        }
    });
}