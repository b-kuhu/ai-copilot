"use client";

import { AppData } from "@/src/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuth, loading } = AppData();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/");
    }
  }, [isAuth, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
}
