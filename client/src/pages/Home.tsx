import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Download, Terminal, Zap } from "lucide-react";
import { useState } from "react";
import { Streamdown } from 'streamdown';

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");

  const installationSteps = [
    {
      number: 1,
      title: "Extract the Extension",
      description: "Download and extract ghostshell_extension.zip to a folder on your computer"
    },
    {
      number: 2,
      title: "Install Dependencies",
      description: "Run: pip install flask flask-cors"
    },
    {
      number: 3,
      title: "Configure Scripts",
      description: "Place your security scripts in the same directory as server.py"
    },
    {
      number: 4,
      title: "Start Backend",
      description: "Run: python3 server.py (keep terminal open)"
    },
    {
      number: 5,
      title: "Load Extension",
      description: "Go to chrome://extensions, enable Developer Mode, click 'Load unpacked'"
    },
    {
      number: 6,
      title: "Verify",
      description: "Click the extension icon and verify the terminal interface appears"
    }
  ];

  const features = [
    {
      icon: Terminal,
      title: "Terminal Interface",
      description: "Dark cyberpunk-inspired UI with neon green accents"
    },
    {
      icon: Zap,
      title: "Real-Time Execution",
      description: "Execute security scripts directly from your browser"
    },
    {
      icon: CheckCircle,
      title: "Four Core Operations",
      description: "Attestation, Merkle Proof, Drift Detection, and Compliance"
    },
    {
      icon: AlertCircle,
      title: "Status Monitoring",
      description: "Real-time status indicators for operation completion"
    }
  ];

  const operations = [
    {
      name: "Attestation",
      command: "gen_attestations.sh",
      description: "Generate security attestations for your codebase, verify code signatures and integrity, and create audit trails for compliance purposes."
    },
    {
      name: "Merkle Proof",
      command: "verify_merkle_proof.py",
      description: "Verify Merkle tree proofs, validate anchoring integrity, and check proof chains."
    },
    {
      name: "Drift Check",
      command: "drift_check.sh",
      description: "Detect configuration drift, identify state inconsistencies, and monitor infrastructure changes."
    },
    {
      name: "Compliance",
      command: "gen_verification_report.sh",
      description: "Generate compliance evidence reports, verify regulatory requirements, and create audit documentation."
    }
  ];

  const troubleshooting = [
    {
      problem: "Extension Won't Load",
      solution: "Verify all required files are present in the directory. Check that manifest.json is valid JSON. Ensure the folder path contains no special characters."
    },
    {
      problem: "Server Connection Error",
      solution: "Verify the Flask server is running: python3 server.py. Check that the server is listening on http://localhost:5000. Ensure no firewall is blocking localhost connections."
    },
    {
      problem: "Scripts Not Executing",
      solution: "Verify script files are in the same directory as server.py. Check script file permissions: chmod +x *.sh. Verify Python scripts have proper shebang."
    },
    {
      problem: "Terminal Output Not Appearing",
      solution: "Ensure the terminal container is scrolled to the bottom. Check browser console for JavaScript errors (F12 → Console). Verify the backend server is returning JSON responses."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-accent glow-text">GhostShell Security</h1>
              <p className="text-muted-foreground mt-1">Chrome Extension Documentation</p>
            </div>
            <Button 
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => window.location.href = '#download'}
            >
              <Download className="w-4 h-4" />
              Download Extension
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border py-12 bg-gradient-to-b from-card/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-4">Secure Your Infrastructure</h2>
            <p className="text-lg text-muted-foreground mb-6">
              The GhostShell Security Attestation Extension provides seamless integration with your security, attestation, and Merkle anchoring workflows. Execute critical security operations directly from your browser with a cyberpunk-inspired terminal interface.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="p-3 bg-card border border-border rounded-lg">
                    <Icon className="w-5 h-5 text-accent mb-2" />
                    <p className="text-sm font-medium">{feature.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-card border border-border">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="installation">Installation</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                  <CardDescription>What makes GhostShell powerful</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div key={idx} className="flex gap-4 p-4 bg-background rounded-lg border border-border/50">
                        <Icon className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      Google Chrome (version 88 or later)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      Python 3.7+ installed on your system
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      pip package manager
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      Your security scripts in a designated directory
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Installation Tab */}
            <TabsContent value="installation" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Step-by-Step Installation</CardTitle>
                  <CardDescription>Follow these steps to get GhostShell running</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {installationSteps.map((step) => (
                    <div key={step.number} className="flex gap-4 p-4 bg-background rounded-lg border border-border/50">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm">
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border bg-card border-accent/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-accent" />
                    Required Commands
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-background p-3 rounded-lg font-mono text-sm border border-border">
                      <p className="text-muted-foreground">$ cd ~/ghostshell-extension</p>
                      <p className="text-accent">pip install flask flask-cors</p>
                    </div>
                    <div className="bg-background p-3 rounded-lg font-mono text-sm border border-border">
                      <p className="text-accent">python3 server.py</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Usage Tab */}
            <TabsContent value="usage" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Core Operations</CardTitle>
                  <CardDescription>Four security operations at your fingertips</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {operations.map((op, idx) => (
                    <div key={idx} className="p-4 bg-background rounded-lg border border-border/50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-accent">{op.name}</h4>
                        <code className="text-xs bg-card px-2 py-1 rounded border border-border text-muted-foreground">
                          {op.command}
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground">{op.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Status Bar Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-background rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">SEC_LEVEL</p>
                      <p className="font-mono text-sm text-accent">ALPHA / BETA / PROD</p>
                    </div>
                    <div className="p-3 bg-background rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">STATUS States</p>
                      <p className="font-mono text-sm text-accent">IDLE / RUNNING / COMPLETED / ERROR</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Troubleshooting Tab */}
            <TabsContent value="troubleshooting" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Common Issues & Solutions</CardTitle>
                  <CardDescription>Resolve common problems quickly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {troubleshooting.map((item, idx) => (
                    <div key={idx} className="p-4 bg-background rounded-lg border border-border/50">
                      <div className="flex items-start gap-3 mb-2">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <h4 className="font-semibold">{item.problem}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">{item.solution}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border bg-card border-accent/50">
                <CardHeader>
                  <CardTitle>Debug Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Check server logs: <code className="bg-background px-2 py-1 rounded text-accent">tail -f server.log</code></p>
                  <p>• Enable Chrome DevTools: <code className="bg-background px-2 py-1 rounded text-accent">F12</code></p>
                  <p>• Test backend directly: <code className="bg-background px-2 py-1 rounded text-accent">curl http://localhost:5000/attestation</code></p>
                  <p>• Check script permissions: <code className="bg-background px-2 py-1 rounded text-accent">chmod +x *.sh</code></p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Advanced Configuration */}
      <section className="border-t border-border py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Advanced Configuration</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Custom Script Paths</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Modify server.py to use scripts from different locations:</p>
                <div className="bg-background p-3 rounded-lg font-mono text-xs border border-border overflow-x-auto">
                  <Streamdown>{`\`\`\`python
SCRIPTS = {
    'attestation': '/path/to/gen_attestations.sh',
    'merkle': '/path/to/verify_merkle_proof.py',
    'drift': '/path/to/drift_check.sh',
    'compliance': '/path/to/gen_verification_report.sh'
}
\`\`\``}</Streamdown>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Change Server Port</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Run the server on a different port:</p>
                <div className="bg-background p-3 rounded-lg font-mono text-xs border border-border overflow-x-auto">
                  <Streamdown>{`\`\`\`python
if __name__ == '__main__':
    app.run(port=8000)  # Change from 5000
\`\`\``}</Streamdown>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Security Considerations</h2>
          <Card className="border-border bg-card">
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-4">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Local Execution Only</h4>
                  <p className="text-sm text-muted-foreground">The extension runs only on localhost:5000 and does not transmit data to external servers.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Protect Your Scripts</h4>
                  <p className="text-sm text-muted-foreground">Keep scripts private, use restrictive file permissions (chmod 700), and monitor server logs.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Network Isolation</h4>
                  <p className="text-sm text-muted-foreground">Never expose the backend server to the internet. Use a firewall to restrict localhost connections if needed.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">GhostShell Security Extension v1.0</p>
              <p className="text-xs text-muted-foreground/70">Last Updated: January 2026</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Status: Stable Release</span>
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              <span>Local Only</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(112, 255, 149, 0.5), 0 0 20px rgba(112, 255, 149, 0.3);
        }
      `}</style>
    </div>
  );
}
