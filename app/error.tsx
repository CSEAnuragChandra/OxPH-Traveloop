"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Something went wrong</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          We encountered an unexpected error. Don't worry — your data is safe. Try refreshing the page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8"
          >
            Try Again
          </Button>
          <Link href="/home">
            <Button variant="outline" className="rounded-full px-8">
              Go Home
            </Button>
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-xs text-gray-300 font-mono">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
