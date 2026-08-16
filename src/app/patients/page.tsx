import StaffOnly from "@/components/StaffOnly";
import PatientFiles from "@/components/PatientFiles";

export default function PatientsPage() {
  return (
    <StaffOnly>
      <PatientFiles />
    </StaffOnly>
  );
}
