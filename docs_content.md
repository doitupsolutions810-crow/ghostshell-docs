# GhostShell Security Extension - Documentation

## Overview

The **GhostShell Security Attestation Extension** is a Chrome extension designed to provide seamless integration with your security, attestation, and Merkle anchoring workflows. It features a cyberpunk-inspired terminal interface that communicates with a local HTTP backend to execute critical security operations and display results in real-time.

## Key Features

- **Terminal-Style Interface**: A dark, neon-green aesthetic inspired by cyberpunk and hacker culture
- **Real-Time Execution**: Run security scripts directly from your browser
- **Four Core Operations**:
  - **Attestation**: Generate security attestations for your codebase
  - **Merkle Proof**: Verify Merkle tree proofs and anchoring
  - **Drift Detection**: Check for configuration or state drift
  - **Compliance Verification**: Generate compliance evidence reports
- **HTTP Backend Integration**: Local Flask server handles script execution
- **Status Monitoring**: Real-time status indicators for operation completion

## Installation Guide

### Prerequisites

Before installing the GhostShell extension, ensure you have:

- **Google Chrome** (version 88 or later)
- **Python 3.7+** installed on your system
- **pip** package manager
- Your security scripts in a designated directory

### Step 1: Extract the Extension Files

1. Download the `ghostshell_extension.zip` file
2. Extract it to a folder on your computer (e.g., `~/ghostshell-extension`)
3. You should see the following files:
   - `manifest.json` - Chrome extension configuration
   - `popup.html` - Extension UI template
   - `popup.js` - Extension logic
   - `styles.css` - Terminal-style CSS
   - `server.py` - Backend HTTP server

### Step 2: Install Python Dependencies

Open your terminal and navigate to the extension directory:

```bash
cd ~/ghostshell-extension
pip install flask flask-cors
```

This installs the Flask web framework and CORS support needed for the backend server.

### Step 3: Configure Your Scripts

Place your security scripts in the same directory as `server.py`:

- `gen_attestations.sh` - Attestation generation script
- `verify_merkle_proof.py` - Merkle proof verification script
- `drift_check.sh` - Drift detection script
- `gen_verification_report.sh` - Compliance report generation script

If you don't have these scripts yet, the server will create placeholder versions automatically.

### Step 4: Start the Backend Server

In your terminal, run:

```bash
python3 server.py
```

You should see output similar to:

```
 * Serving Flask app 'server'
 * Debug mode: off
 * Running on http://127.0.0.1:5000
```

**Keep this terminal window open** while using the extension. The server must be running for the extension to function.

### Step 5: Load the Extension into Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer Mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the folder containing your extension files
5. The GhostShell extension should now appear in your extensions list

### Step 6: Verify Installation

1. Click the GhostShell extension icon in your Chrome toolbar
2. You should see the terminal interface with the message: "System ready. Waiting for command."
3. If you see an error, ensure the backend server is running on `http://localhost:5000`

## Usage Guide

### Opening the Extension

Click the GhostShell extension icon in your Chrome toolbar to open the popup. The interface displays:

- **Title**: "GhostShell Security" in glowing green text
- **Terminal Display**: A scrollable log area showing command output
- **Control Buttons**: Four operation buttons arranged in a 2x2 grid
- **Status Bar**: Shows security level and current operation status

### Running Operations

#### Attestation

Click the **Attestation** button to:
- Generate security attestations for your codebase
- Verify code signatures and integrity
- Create audit trails for compliance purposes

The terminal will display:
```
> Executing attestation...
[SUCCESS] Attestation generated
[INFO] Signature verified
```

#### Merkle Proof

Click the **Merkle Proof** button to:
- Verify Merkle tree proofs
- Validate anchoring integrity
- Check proof chains

Expected output:
```
> Executing merkle...
[SUCCESS] Merkle proof verified
[INFO] Anchor chain valid
```

#### Drift Check

Click the **Drift Check** button to:
- Detect configuration drift
- Identify state inconsistencies
- Monitor infrastructure changes

Example output:
```
> Executing drift...
[SUCCESS] No drift detected
[INFO] All systems nominal
```

#### Compliance

Click the **Compliance** button to:
- Generate compliance evidence reports
- Verify regulatory requirements
- Create audit documentation

Sample output:
```
> Executing compliance...
[SUCCESS] Compliance report generated
[INFO] All checks passed
```

### Understanding the Status Bar

The status bar at the bottom shows:

- **SEC_LEVEL**: Security clearance level (ALPHA, BETA, PROD)
- **STATUS**: Current operation state
  - `IDLE` - Waiting for command
  - `RUNNING` - Operation in progress
  - `COMPLETED` - Operation finished successfully
  - `ERROR` - Operation failed

## Troubleshooting

### Extension Won't Load

**Problem**: Chrome shows "Error loading unpacked extension"

**Solution**:
1. Verify all required files are present in the directory
2. Check that `manifest.json` is valid JSON (use a JSON validator)
3. Ensure the folder path contains no special characters

### Server Connection Error

**Problem**: Extension shows "Error: Failed to fetch"

**Solution**:
1. Verify the Flask server is running: `python3 server.py`
2. Check that the server is listening on `http://localhost:5000`
3. Ensure no firewall is blocking localhost connections
4. Try accessing `http://localhost:5000/attestation` in your browser

### Scripts Not Executing

**Problem**: Operations return "Simulated output" instead of real results

**Solution**:
1. Verify script files are in the same directory as `server.py`
2. Check script file permissions: `chmod +x *.sh`
3. Verify Python scripts have proper shebang: `#!/usr/bin/env python3`
4. Check server logs for error messages

### Terminal Output Not Appearing

**Problem**: Commands execute but no output is shown

**Solution**:
1. Ensure the terminal container is scrolled to the bottom
2. Check browser console for JavaScript errors (F12 → Console)
3. Verify the backend server is returning JSON responses
4. Clear browser cache and reload the extension

## Advanced Configuration

### Custom Script Paths

To use scripts from different locations, modify `server.py`:

```python
SCRIPTS = {
    'attestation': '/path/to/gen_attestations.sh',
    'merkle': '/path/to/verify_merkle_proof.py',
    'drift': '/path/to/drift_check.sh',
    'compliance': '/path/to/gen_verification_report.sh'
}
```

### Changing Server Port

To run the server on a different port, modify `server.py`:

```python
if __name__ == '__main__':
    app.run(port=8000)  # Change from 5000 to 8000
```

Then update `popup.js` to match:

```javascript
const response = await fetch(`http://localhost:8000/${endpoint}`);
```

### Customizing the UI

Edit `styles.css` to change colors:

```css
:root {
  --bg-color: #0a0a0a;        /* Background color */
  --text-color: #00ff41;      /* Text color */
  --accent-color: #008f11;    /* Accent color */
  --border-color: #003b00;    /* Border color */
}
```

## Security Considerations

### Local Execution Only

The GhostShell extension is designed for local development and testing. It:
- Runs only on `http://localhost:5000`
- Does not transmit data to external servers
- Requires explicit user action to execute scripts
- Maintains all data locally

### Protecting Your Scripts

1. **Keep scripts private**: Store scripts in a secure directory
2. **Limit permissions**: Use restrictive file permissions (`chmod 700`)
3. **Audit logs**: Monitor server logs for unauthorized access attempts
4. **Network isolation**: Run the server only on trusted networks

### Best Practices

- Never expose the backend server to the internet
- Use a firewall to restrict localhost connections if needed
- Regularly update Flask and dependencies: `pip install --upgrade flask flask-cors`
- Review script output for unexpected results

## Support and Feedback

For issues, feature requests, or contributions:

1. Check the troubleshooting section above
2. Review server logs: `tail -f server.log`
3. Enable Chrome developer tools (F12) to inspect network requests
4. Document your issue with:
   - Chrome version
   - Python version
   - Error messages
   - Steps to reproduce

## Version History

### v1.0 (Initial Release)
- Terminal-style UI with cyberpunk aesthetic
- Four core security operations
- Flask backend integration
- Real-time status monitoring
- Support for custom script paths

## License

GhostShell Security Extension is provided as-is for security research and development purposes.

---

**Last Updated**: January 2026
**Status**: Stable Release
