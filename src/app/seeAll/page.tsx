import StaffOnly from "@/components/StaffOnly";
import AllData from "@/components/AllData";

export default function SeeAllPage() {
  return (
    <StaffOnly>
      <AllData />
    </StaffOnly>
  );
}
