# Integration Tests

This folder contains a minimal curl-based integration test for the local Flask test server.

Prerequisites:
- Python 3 installed
- `extension/server.py` present and running (binds to `127.0.0.1:5000`)

How to run:
1. In one terminal: `cd extension && python3 server.py`
2. In another terminal: `bash tests/integration.sh`

The script expects the server to return JSON with a `status` field set to `success` for each endpoint: `/attestation`, `/merkle`, `/drift`, `/compliance`.
