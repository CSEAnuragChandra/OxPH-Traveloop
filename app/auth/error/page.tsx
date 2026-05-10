import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            We could not sign you in. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If the problem continues, reach out to support with a screenshot of
            this page.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link href="/auth/signin">Back to sign in</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
