import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput("website url");
        console.log("@@WEBSITE URL: ", websiteUrl)
        const browser = await puppeteer.launch({
            headless: false // for testing
        })

        await waitFor(3000);
        await browser.close();

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}