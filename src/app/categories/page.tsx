import StaffOnly from "@/components/StaffOnly";
import CategoryManager from "@/components/CategoryManager";

export default function CategoriesPage() {
  return (
    <StaffOnly>
      <CategoryManager />
    </StaffOnly>
  );
}
