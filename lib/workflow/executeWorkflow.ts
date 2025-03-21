import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, ExecutionStatus } from "@/types/workflow";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { TaskType } from "@/types/task";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { env } from "process";

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
    const environment: Environment = {
        phases: {}
    };

    // TODO: initialize workflow execution
    await initializeWorkflowExecution(executionId, execution.workflowId);

    // TODO: intialize phases status
    await initializePhaseStatuses(execution);

    let creditsConsumed = 0;

    let executionFailed = false;
    for (const phase of execution.phases) {
        // TODO: consume credits
        // TODO: execute phase
        const phaseExecution = await executeWorkflowPhase(phase, environment);

        if (!phaseExecution.success) {
            executionFailed = true;
            break;
        }
    }

    // TODO: finalize execution
    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed);

    // TODO: clean up environment

    revalidatePath("/workflows/runs")
}

async function initializeWorkflowExecution(
    executionId: string, 
    workflowId: string
) {
    await prisma.workflowExecution.update({
        where: {
            id: executionId,
        },
        data: {
            startedAt: new Date(),
            status: ExecutionStatus.RUNNING
        }
    });

    await prisma.workflow.update({
        where: {
            id: workflowId,
        },
        data: {
            lastRunAt: new Date(),
            lastRunStatus: ExecutionStatus.RUNNING,
            lastRunId: executionId
        }
    });
}

async function initializePhaseStatuses(execution: any) {
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phase: any) => phase.id)
            }
        },
        data: {
            status: ExecutionPhaseStatus.PENDING,
        }
    })
}

async function finalizeWorkflowExecution(executionId: string, workflowId: string, executionFailed: boolean, creditsConsumed: number) {
    const finalStatus = executionFailed ? ExecutionStatus.FAILED : ExecutionStatus.COMPLETED;

    await prisma.workflowExecution.update({
        where: {
            id: executionId,
        },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            creditsConsumed
        }
    });

    await prisma.workflow.update({
        where: {
            id: workflowId,
            lastRunId: executionId,
        },
        data: {
            lastRunStatus: finalStatus
        }
    }).catch(err => {
        // Ignore
        // this means that we have triggered other runs for this workflow
        // while an execution is running
    })
}

async function executeWorkflowPhase(phase: ExecutionPhase, environment: Environment) {
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode;
    setupEnvironmentForPhase(node, environment);

    await prisma.executionPhase.update({
        where: {
            id: phase.id,
        },
        data: {
            status: ExecutionPhaseStatus.RUNNING,
            startedAt
        }
    });

    const creditsRequired = TaskRegistry[node.data.type].credits;
    console.log(`Executing ${phase.name} with ${creditsRequired} credits required`);

    // TODO: decrement user balance (with required credits)

    // Execute phase simulation
    const success = await executePhase(phase, node, environment);

    await finalizePhase(phase.id, success);
    return { success };
}

async function finalizePhase(phaseId: string, success: boolean) {
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;

    await prisma.executionPhase.update({
        where: {
            id: phaseId
        },
        data: {
            status: finalStatus,
            completedAt: new Date()
        }
    })
}

async function executePhase(
    phase: ExecutionPhase,
    node: AppNode,
    environment: Environment
): Promise<boolean> {
    const runFn = ExecutorRegistry[node.data.type];

    if (!runFn) {
        return false;
    }

    const ExecutionEnvironment: ExecutionEnvironment = createExecutionEnvironment(node, environment);

    return await runFn(ExecutionEnvironment);
}

function setupEnvironmentForPhase(node: AppNode, environment: Environment) {
    environment.phases[node.id] = {
        inputs: {},
        outputs: {}
    };

    const inputs = TaskRegistry[node.data.type].inputs;

    for (const input of inputs) {
        const inputValue = node.data.inputs[input.name];

        if (inputValue) {
            environment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }

        // TODO: Get input value from outputs in the environment
    }
}

function createExecutionEnvironment(node: AppNode, environment: Environment) {
    return {
        getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    }
}