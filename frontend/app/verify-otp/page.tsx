import ProtectedRoute from "@/src/components/ProtectedRoute";
import VerifyOtp from "@/src/components/VerifyOtp";

export default function VerifyOtpPage() {
    return (
    <ProtectedRoute>
      <VerifyOtp />
    </ProtectedRoute>
  );
}