import { auth } from "@/auth";
import { db } from "@/db";
import { surveyResponses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SurveyForm } from "@/components/survey-form";
import { LoginButton } from "@/components/login-button";

export default async function SurveyPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Watch Party Survey
        </h1>
        <p className="text-gray-500 mb-8">
          Sign in with Google to tell us which games you want to watch and
          whether you can host.
        </p>
        <LoginButton />
      </div>
    );
  }

  // Fetch existing response (graceful if no DB)
  type SurveyRow = typeof surveyResponses.$inferSelect;
  let existing: SurveyRow[] = [];
  try {
    existing = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.userId, session.user.id))
      .limit(1);
  } catch {
    // No database connected
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Watch Party Survey
        </h1>
        <p className="text-gray-500">
          {existing.length > 0
            ? "Update your preferences below."
            : "Tell us about your World Cup plans!"}
        </p>
      </div>

      <SurveyForm
        initialData={existing[0] ?? null}
        userEmail={session.user.email ?? ""}
        userName={session.user.name ?? ""}
      />
    </div>
  );
}
