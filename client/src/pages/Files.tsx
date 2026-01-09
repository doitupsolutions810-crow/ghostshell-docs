import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { FileUp, Trash2, Download, AlertCircle, CheckCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Files() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    fileName: "",
    description: "",
    tags: "",
  });

  // Fetch files list
  const { data: files = [], isLoading, refetch } = trpc.files.list.useQuery();

  // Upload mutation
  const uploadMutation = trpc.files.upload.useMutation({
    onSuccess: () => {
      toast.success("File uploaded successfully");
      setUploadData({ fileName: "", description: "", tags: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload file");
    },
  });

  // Delete mutation
  const deleteMutation = trpc.files.delete.useMutation({
    onSuccess: () => {
      toast.success("File deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete file");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="border-border bg-card max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Please sign in to access the file manager.
            </p>
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => setLocation("/")}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileData = event.target?.result as string;
        const base64Data = fileData.split(",")[1];

        await uploadMutation.mutateAsync({
          fileName: file.name,
          fileData: base64Data,
          mimeType: file.type,
          fileSize: file.size,
          description: uploadData.description,
          tags: uploadData.tags,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Failed to read file");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-accent glow-text">File Manager</h1>
              <p className="text-muted-foreground mt-1">Upload and manage your security scripts</p>
            </div>
            <Button
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => setLocation("/")}
            >
              Back to Docs
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Upload Section */}
          <Card className="border-border bg-card mb-8 border-accent/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-accent" />
                Upload New File
              </CardTitle>
              <CardDescription>Upload security scripts and documents to cloud storage</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <FileUp className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-border bg-card">
                  <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                      Add metadata for your file before uploading
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">File</label>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                        className="mt-1 border-border"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Describe what this file does..."
                        value={uploadData.description}
                        onChange={(e) =>
                          setUploadData({ ...uploadData, description: e.target.value })
                        }
                        className="mt-1 border-border"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tags</label>
                      <Input
                        placeholder="e.g., attestation, merkle, security"
                        value={uploadData.tags}
                        onChange={(e) =>
                          setUploadData({ ...uploadData, tags: e.target.value })
                        }
                        className="mt-1 border-border"
                      />
                    </div>
                    <Button
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      disabled={isUploading || uploadMutation.isPending}
                    >
                      {isUploading || uploadMutation.isPending ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Files List */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Your Files</CardTitle>
              <CardDescription>
                {files.length} file{files.length !== 1 ? "s" : ""} uploaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"></div>
                  </div>
                </div>
              ) : files.length === 0 ? (
                <div className="py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No files uploaded yet</p>
                  <p className="text-sm text-muted-foreground">
                    Upload your first security script to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 bg-background rounded-lg border border-border/50 hover:border-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-accent mb-1">{file.fileName}</h4>
                          {file.description && (
                            <p className="text-sm text-muted-foreground mb-2">{file.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              {formatFileSize(file.fileSize)}
                            </span>
                            <span>{formatDate(file.createdAt)}</span>
                            {file.tags && (
                              <span className="px-2 py-1 bg-accent/10 text-accent rounded">
                                {file.tags}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(file.url, "_blank")}
                            className="border-border hover:bg-accent/10"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteMutation.mutate({ fileId: file.id })}
                            disabled={deleteMutation.isPending}
                            className="border-border hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <style>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(112, 255, 149, 0.5), 0 0 20px rgba(112, 255, 149, 0.3);
        }
      `}</style>
    </div>
  );
}
