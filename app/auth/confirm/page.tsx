import { Mail } from 'lucide-react';

export default function AuthConfirmPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="max-w-md text-center p-8">
        <div className="flex justify-center mb-6">
          <Mail className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-4">Check your email</h1>
        <p className="text-muted-foreground">
          We've sent a confirmation link to your email address. Please click the link to complete the sign-up process.
        </p>
      </div>
    </div>
  );
}

