import PatientOnly from "@/components/PatientOnly";
import PatientPortal from "@/components/PatientPortal";

export default function PortalPage() {
  return (
    <PatientOnly>
      <PatientPortal />
    </PatientOnly>
  );
}
