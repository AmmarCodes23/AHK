import StaffOnly from "@/components/StaffOnly";
import BalanceData from "@/components/BalanceData";

export default function CheckBalancePage() {
  return (
    <StaffOnly admin>
      <BalanceData />
    </StaffOnly>
  );
}
