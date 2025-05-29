import { spawn, ChildProcess } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

export class PocketBaseManager {
  private process: ChildProcess | null = null;
  private isStarting = false;

  async start(): Promise<void> {
    if (this.process || this.isStarting) {
      return; // Already running or starting
    }

    this.isStarting = true;

    try {
      // First check if PocketBase is already running
      if (await this.isPocketBaseRunning()) {
        console.error("PocketBase is already running");
        this.isStarting = false;
        return;
      }

      // Get the directory where this script is located
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const projectRoot = join(__dirname, "..");
      const pocketbasePath = join(projectRoot, "pocketbase", "pocketbase");

      console.error("Starting PocketBase server...");

      this.process = spawn(pocketbasePath, ["serve"], {
        cwd: projectRoot,
        stdio: ["ignore", "ignore", "ignore"], // Suppress all output
        detached: false,
      });

      // Simple startup: just wait a short time and check if it's running
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (await this.isPocketBaseRunning()) {
        console.error("PocketBase started successfully");
      } else {
        throw new Error("PocketBase failed to start");
      }
    } catch (error) {
      console.error("Failed to start PocketBase:", error);
      this.process = null;
    } finally {
      this.isStarting = false;
    }
  }

  private async isPocketBaseRunning(): Promise<boolean> {
    try {
      const response = await fetch("http://127.0.0.1:8090/api/health", {
        method: "GET",
        signal: AbortSignal.timeout(1000), // 1 second timeout
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  stop(): void {
    if (this.process) {
      console.error("Stopping PocketBase...");
      this.process.kill();
      this.process = null;
    }
  }
}
