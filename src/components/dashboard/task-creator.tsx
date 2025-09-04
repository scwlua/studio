'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { suggestTaskFromImage } from '@/ai/flows/task-from-image';
import { BrainCircuit, Loader2, Mic, Plus, Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

export function TaskCreator() {
  const [task, setTask] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setTask(transcript);
            stopListening();
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            toast({ title: "Voice Error", description: "Could not understand audio.", variant: "destructive" });
            stopListening();
        };

        recognitionRef.current.onend = () => {
            stopListening();
        };
    }
  }, [toast]);
  
  useEffect(() => {
    if (isCameraOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({video: true});
          setHasCameraPermission(true);
  
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this app.',
          });
        }
      };
      getCameraPermission();
    } else {
        if(videoRef.current && videoRef.current.srcObject){
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [isCameraOpen, toast]);


  const startListening = () => {
      if (recognitionRef.current) {
          setIsListening(true);
          recognitionRef.current.start();
      } else {
          toast({ title: "Voice Input not supported", description: "Your browser does not support speech recognition.", variant: "destructive" });
      }
  };

  const stopListening = () => {
      if (recognitionRef.current) {
          setIsListening(false);
          // It may be that the recognition is already stopped.
          try {
            recognitionRef.current.stop();
          } catch(e) {}
      }
  };

  const handleMicClick = () => {
      if (isListening) {
          stopListening();
      } else {
          startListening();
      }
  };

  const handleImageAnalysis = async (imageDataUri: string) => {
    setIsAiLoading(true);
    try {
      const result = await suggestTaskFromImage({ photoDataUri: imageDataUri });
      setTask(result.task);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
      setIsCameraOpen(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/png');
        handleImageAnalysis(dataUri);
      }
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        handleImageAnalysis(dataUri);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    toast({
        title: "Move Added",
        description: `"${task}" has been added to your board.`
    });
    setTask('');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Plus className="text-primary" />
            Add a Move
          </CardTitle>
          <CardDescription>
            Quickly add a new task to your board using text, voice, or an image.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
                <Input 
                    placeholder="e.g., Buy groceries" 
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    disabled={isAiLoading}
                    className="pr-20"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={handleMicClick}>
                        {isListening ? <Loader2 className="animate-spin text-primary" /> : <Mic />}
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsCameraOpen(true)}>
                        <Camera />
                    </Button>
                </div>
            </div>
            <Button type="submit" disabled={isAiLoading || !task}>
              {isAiLoading ? <Loader2 className="animate-spin" /> : "Add Move"}
            </Button>
          </form>

          {isAiLoading && (
            <div className="mt-6 text-center text-muted-foreground flex items-center justify-center gap-2">
              <BrainCircuit className="animate-pulse text-primary" />
              <span>The Grandmaster is analyzing...</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">Capture an Image</DialogTitle>
            <DialogDescription>
              Snap a picture for the AI to analyze, or upload an image file. The AI can perform OCR or suggest a task based on the image's context.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <video ref={videoRef} className="w-full aspect-video rounded-md bg-secondary" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="hidden" />

            {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access to use this feature. You can still upload a file.
                  </AlertDescription>
              </Alert>
            )}

            <div className='flex justify-between items-center'>
              <Button onClick={handleCapture} disabled={!hasCameraPermission || isAiLoading}>
                {isAiLoading ? <Loader2 className="animate-spin" /> : <Camera className="mr-2"/>}
                {isAiLoading ? 'Analyzing...' : 'Snap Picture'}
              </Button>
              <div className="text-sm text-muted-foreground">or</div>
              <Button asChild variant="outline">
                <label htmlFor="file-upload">
                  Upload File
                  <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} className="sr-only" />
                </label>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
