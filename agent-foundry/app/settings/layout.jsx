import ProtectedRoute from "@/components/ProtectedRoute";

export default function SettingsLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
