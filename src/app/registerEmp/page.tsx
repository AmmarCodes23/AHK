import StaffOnly from "@/components/StaffOnly";
import RegisterEmp from "@/components/RegisterEmp";

export default function RegisterEmpPage() {
  return (
    <StaffOnly admin>
      <RegisterEmp />
    </StaffOnly>
  );
}
