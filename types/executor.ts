import { Browser } from "puppeteer"

export type Environment = {
    browser?: Browser
    // Phases with nodeId/taskId as key
    phases: Record<
        string, //key: nodeId
        {
            inputs: Record<string, string>
            outputs: Record<string, string>
        }
    >
}

export type ExecutionEnvironment = {
    getInput(name: string): string;
}