'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStorage, useUser } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { FileUp, FileText, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function PdfUploadPage() {
  const { user } = useUser();
  const storage = useStorage();
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast({ title: 'Invalid File', description: 'Please select a PDF file.', variant: 'destructive' });
        return;
      }
      setFile(selectedFile);
      setUploadProgress(0);
      setDownloadUrl(null);
    }
  };

  const handleUpload = () => {
    if (!file || !user) return;

    setIsUploading(true);
    const storageRef = ref(storage, `pdfs/${user.uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setIsUploading(false);
        toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
      },
      async () => {
        setIsUploading(false);
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadUrl(url);
        toast({ title: 'Upload Complete', description: 'Your PDF has been successfully uploaded.' });
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-6">
      <Card className="w-full max-w-lg border-border/60 shadow-lg">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <FileUp className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">Upload Study Material</CardTitle>
          <CardDescription>Upload your PDF notes and slides to access them anywhere.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid w-full max-w-sm mx-auto items-center gap-1.5">
              <Label htmlFor="pdf" className="sr-only">Select PDF</Label>
              <Input id="pdf" type="file" accept="application/pdf" onChange={handleFileChange} disabled={isUploading} className="cursor-pointer" />
            </div>

            {file && (
              <div className="flex items-center gap-3 p-4 border rounded-xl bg-muted/30">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {downloadUrl && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <CheckCircle2 className="h-5 w-5" />
                <span>Upload successful! <a href={downloadUrl} target="_blank" rel="noreferrer" className="underline font-medium ml-1">View PDF</a></span>
              </div>
            )}
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading} 
            className="w-full h-11"
          >
            {isUploading ? 'Uploading...' : 'Upload PDF'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
