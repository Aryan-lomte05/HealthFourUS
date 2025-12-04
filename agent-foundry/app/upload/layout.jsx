import ProtectedRoute from "@/components/ProtectedRoute";

export default function UploadLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
