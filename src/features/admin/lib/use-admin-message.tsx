"use client";

import { useCallback, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";

export function useAdminMessage() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showSuccess = useCallback((text: string) => {
    setMessage({ type: "success", text });
  }, []);

  const showError = useCallback((text: string) => {
    const errText =
      text ||
      "An unexpected error occurred. The API endpoint may not be available.";
    setMessage({ type: "error", text: errText });
  }, []);

  const clear = useCallback(() => setMessage(null), []);

  const MessageAlert = message ? (
    <Alert variant={message.type === "error" ? "destructive" : "default"}>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{message.text}</span>
        <button
          type="button"
          onClick={clear}
          className="text-xs underline"
        >
          Dismiss
        </button>
      </AlertDescription>
    </Alert>
  ) : null;

  return { showSuccess, showError, clear, MessageAlert, message };
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const data = (error as { response?: { data?: { message?: string } } })
      .response?.data;
    if (data?.message) return data.message;
  }
  if (error instanceof Error) return error.message;
  return "Request failed";
}
