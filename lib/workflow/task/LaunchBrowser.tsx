import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";
import "tailwindcss"

export const LaunchBrowserTask = {
    type: TaskType.LAUNCH_BROWSER,
    // this task type is more server intensive so more credits
    credits: 5,
    label: "Launch Browser",
    icon: (props: LucideProps) => (
        <GlobeIcon className="stroke-pink-400" {...props} />
    ),
    isEntryPoint: true,
    inputs: [
        {
            name: "Website Url",
            type: TaskParamType.STRING,
            helperText: "eg: https://www.yourwebsite.com",
            required: true,
            hideHandle: true
        }
    ],
    outputs: [
        {
            name: "Web page", type: TaskParamType.BROWSER_INSTANCE
        }
    ]
} satisfies WorkflowTask;