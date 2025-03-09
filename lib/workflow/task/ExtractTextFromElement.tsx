import { TaskParamType, TaskType } from "@/types/task";
import { LucideProps, TextIcon } from "lucide-react";
import "tailwindcss"

export const ExtractTextFromElement = {
    type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
    label: "Extract Text From Element",
    icon: (props: LucideProps) => (
        <TextIcon className="stroke-rose-400" {...props} />
    ),
    isEntryPoint: false,
    inputs: [
        {
            name: "Html",
            type: TaskParamType.STRING,
            required: true,
            variant: "textarea"
        },
        {
            name: "Selector",
            type: TaskParamType.STRING,
            required: true
        }
    ],
    outputs: [
        {
            name: "Extracted Text",
            type: TaskParamType.STRING
        },
    ]
}