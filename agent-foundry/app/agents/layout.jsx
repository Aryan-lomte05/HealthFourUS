import ProtectedRoute from "@/components/ProtectedRoute";

export default function AgentsLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
