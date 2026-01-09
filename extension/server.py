#!/usr/bin/env python3
"""Minimal Flask server stub that implements the documented endpoint contract.

This file is intentionally small and safe for local development. It binds to 127.0.0.1:5000 only,
and executes scripts found in the `extension/scripts/` directory.

Security: Do NOT expose this service to the internet. The server runs scripts from disk and
should only be used in a trusted, local environment for testing and demos.
"""

from pathlib import Path
import subprocess
import json
from flask import Flask, jsonify, abort
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
SCRIPTS_DIR = BASE_DIR / "scripts"

SCRIPTS = {
    "attestation": SCRIPTS_DIR / "gen_attestations.sh",
    "merkle": SCRIPTS_DIR / "verify_merkle_proof.py",
    "drift": SCRIPTS_DIR / "drift_check.sh",
    "compliance": SCRIPTS_DIR / "gen_verification_report.sh",
}

app = Flask(__name__)
CORS(app, origins="*")


def run_script(path: Path):
    if not path.exists():
        return {"output": f"Script not found: {path}", "status": "error"}

    try:
        # Use shell execution for flexible scripts (keep simple). Capture stdout/stderr.
        completed = subprocess.run([str(path)], capture_output=True, text=True, timeout=60)
        output = (completed.stdout or "") + (completed.stderr or "")
        status = "success" if completed.returncode == 0 else "error"
        return {"output": output.strip(), "status": status}
    except subprocess.TimeoutExpired:
        return {"output": "Script timed out", "status": "error"}
    except Exception as exc:
        return {"output": f"Execution failed: {exc}", "status": "error"}


@app.get("/attestation")
def attestation():
    return jsonify(run_script(SCRIPTS["attestation"]))


@app.get("/merkle")
def merkle():
    return jsonify(run_script(SCRIPTS["merkle"]))


@app.get("/drift")
def drift():
    return jsonify(run_script(SCRIPTS["drift"]))


@app.get("/compliance")
def compliance():
    return jsonify(run_script(SCRIPTS["compliance"]))


@app.get("/")
def root():
    return jsonify({"status": "ok", "message": "GhostShell local test server"})


if __name__ == "__main__":
    # Bind to localhost only for safety.
    # Honor PORT environment variable so tests can run on alternate ports if 5000 is in use.
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="127.0.0.1", port=port)
