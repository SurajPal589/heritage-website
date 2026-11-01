import subprocess
import time
import sys

def run_tunnel():
    while True:
        try:
            print("[Tunnel] Starting localtunnel on port 5173...")
            proc = subprocess.Popen(
                ["npx.cmd", "localtunnel", "--port", "5173", "--subdomain", "heritageverse-ai"],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True
            )
            for line in proc.stdout:
                sys.stdout.write(line)
                sys.stdout.flush()
            proc.wait()
        except Exception as e:
            print(f"[Tunnel] Error: {e}")
        print("[Tunnel] Connection dropped, reconnecting in 3 seconds...")
        time.sleep(3)

if __name__ == '__main__':
    run_tunnel()

