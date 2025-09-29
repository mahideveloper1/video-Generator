import { VideoGenerationForm } from '@/components/VideoGenerationForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Personalized Video Generator
          </h1>
          <p className="text-gray-600">
            Create and receive your personalized video via WhatsApp
          </p>
        </div>
        
        <VideoGenerationForm />
      </div>
    </main>
  );
}