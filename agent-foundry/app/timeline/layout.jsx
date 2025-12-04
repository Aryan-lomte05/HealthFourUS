import ProtectedRoute from "@/components/ProtectedRoute";

export default function TimelineLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
