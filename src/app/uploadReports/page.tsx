import StaffOnly from "@/components/StaffOnly";
import ReportData from "@/components/ReportData";

export default function UploadReportsPage() {
  return (
    <StaffOnly>
      <ReportData />
    </StaffOnly>
  );
}
