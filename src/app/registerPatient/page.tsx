import StaffOnly from "@/components/StaffOnly";
import RegisterPatient from "@/components/RegisterPatient";

export default function RegisterPatientPage() {
  return (
    <StaffOnly>
      <RegisterPatient />
    </StaffOnly>
  );
}
