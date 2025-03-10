import { Node } from "@xyflow/react";
import { TaskParam, TaskType } from "./task";

export interface AppNodeData {
    type: TaskType;
    inputs: Record<string, string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface AppNode extends Node {
    data: AppNodeData;
}

export interface ParamProps {
    param: TaskParam;
    value: string;
    updateNodeParamValue: (newvalue: string) => void;
    disabled?: boolean
}

export type AppNodeMissingInputs = {
    nodeId: string;
    inputs: string[];
}