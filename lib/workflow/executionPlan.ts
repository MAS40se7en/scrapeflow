import { AppNode } from "@/types/appNode";
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

type FlowToExecutionPlanType = {
    executionPlan?: WorkflowExecutionPlan;
}

export function FlowToExecutionPlan(nodes: AppNode[], edges: Edge[]):
    FlowToExecutionPlanType {

        if (!nodes || !edges) return {};
        const entryPoint = nodes.find((node) => TaskRegistry[node.data.type].isEntryPoint);

        if (!entryPoint) {
            throw new Error("TODO: HANDLE THIS ERROR (NO ENTRY POINT FOUND)")
        }

        const planned = new Set<string>();
    
        const executionPlan: WorkflowExecutionPlan = [
            {
                phase: 1,
                nodes: [entryPoint]
            }
        ];

        for (
            let phase = 2;
            phase <= nodes.length || planned.size < nodes.length;
            phase++
        ) {
                const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

                for (const currentNode of nodes) {
                    if (planned.has(currentNode.id)) {
                        //Not in the execution plan
                        continue;
                    }

                    const invalidInputs = getInvalidInputs(currentNode, edges, planned);

                    if (invalidInputs.length > 0) {
                        const incomers = getIncomers(currentNode, nodes, edges);
                        if (incomers.every((incomer) => planned.has(incomer.id))) {
                            //if all incoming incomers/edges are planned and there are still invalid inputs,
                            //this means that this particular node has an invalid input,
                            //which means that the workflow is invalid
                            console.error("invalid inputs", currentNode, invalidInputs);
                            throw new Error("TODO: HANDLE ERROR 1")
                        } else {
                            continue;
                        }
                    }

                    nextPhase.nodes.push(currentNode);
                    planned.add(currentNode.id);
                }

                executionPlan.push(nextPhase);
        }

        return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
    const invalidInputs = [];

    const inputs = TaskRegistry[node.data.type].inputs;

    for (const input of inputs) {
        const inputValue = node.data.inputs[input.name];
        const inputValueProvided = inputValue?.length > 0;

        if (inputValueProvided) {
            //this input is valid
            continue;
        }

        //if a value is provided by the user then we need to check if
        //there is an output linked to the current input
        const incomingEdges = edges.filter((edge) => edge.target === node.id);

        const inputLinkedToOutput = incomingEdges.find(
            (edge) => edge.target === node.id
        );

        const requiredInputProvidedByVisitedOutput =
            input.required && inputLinkedToOutput && planned.has(inputLinkedToOutput.source);

        if (requiredInputProvidedByVisitedOutput) {
            //the inputs is required and we have a valid value for it
            // provided by a task that is already planned
            continue;
        } else if (!input.required) {
            //if the input is not required by there is an output linked
            // to it then we need to be sure that the output is provided
            if (!inputLinkedToOutput) continue;
            if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
                //The output is providing a value to the input: the input is fine
                continue;
            }
        }

        invalidInputs.push(input.name);
    }

    return invalidInputs;


}