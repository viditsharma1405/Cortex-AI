import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const services = [
  { name: "GATEWAY ", color: "\x1b[36m", cwd: path.join(__dirname, "backend/gateway"), cmd: "npm", args: ["run", "dev"] },
  { name: "AUTH    ", color: "\x1b[32m", cwd: path.join(__dirname, "backend/services/auth"), cmd: "npm", args: ["run", "dev"] },
  { name: "CHAT    ", color: "\x1b[33m", cwd: path.join(__dirname, "backend/services/chat"), cmd: "npm", args: ["run", "dev"] },
  { name: "AGENT   ", color: "\x1b[35m", cwd: path.join(__dirname, "backend/services/agent"), cmd: "npm", args: ["run", "dev"] },
  { name: "BILLING ", color: "\x1b[34m", cwd: path.join(__dirname, "backend/services/billing"), cmd: "npm", args: ["run", "dev"] },
  { name: "FRONTEND", color: "\x1b[31m", cwd: path.join(__dirname, "frontend"), cmd: "npm", args: ["run", "dev"] },
];

const RESET = "\x1b[0m";
const children = [];

console.log("\x1b[1m\x1b[32m🚀 Starting CortexAI Microservices & Frontend...\x1b[0m\n");

for (const svc of services) {
  const child = spawn(svc.cmd, svc.args, {
    cwd: svc.cwd,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, FORCE_COLOR: "true" }
  });

  child.stdout.on("data", (data) => {
    const lines = data.toString().split("\n");
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${svc.color}[${svc.name}]${RESET} ${line}`);
      }
    }
  });

  child.stderr.on("data", (data) => {
    const lines = data.toString().split("\n");
    for (const line of lines) {
      if (line.trim()) {
        console.error(`${svc.color}[${svc.name} ERR]${RESET} ${line}`);
      }
    }
  });

  child.on("close", (code) => {
    console.log(`${svc.color}[${svc.name}]${RESET} exited with code ${code}`);
  });

  children.push(child);
}

function cleanup() {
  console.log("\n\x1b[33m🛑 Stopping all CortexAI services...\x1b[0m");
  for (const child of children) {
    try {
      child.kill("SIGTERM");
    } catch (e) {
      // ignore
    }
  }
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
