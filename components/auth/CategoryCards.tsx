import { newCategories } from "@/data/categories";
import { Category } from "@/types/onboarding";
import { CircleCheck } from "lucide-react";

const Card = ({
  category,
  activeCategories,
}: {
  category: Category;
  activeCategories: string[];
}) => {
  const { name, id } = category;
  const isActive = activeCategories.includes(id);
  return (
    <div
      className={`flex gap-2 justify-center items-center ${
        activeCategories.includes(id) ? "border border-primary gap-2" : "border"
      } bg-white rounded-lg cursor-pointer py-2 px-6 `}
    >
      {isActive && <CircleCheck color="#6750a4" className="w-4 h-4" />}
      <p className="text-xs">{name}</p>
    </div>
  );
};

const CategoryCards = ({
  activeCategories,
  handleCategories,
}: {
  activeCategories: string[];
  handleCategories: (categoryId: string) => void;
}) => {
  return (
    <div className="flex flex-col">
      <p className="text-[var(--secondary-text-color)] text-sm text-center font-semibold my-6">
        Let us personalize more
      </p>
      <ol className="flex flex-row flex-wrap gap-2 w-fit self-center justify-center mb-4">
        {(newCategories as Category[]).map((category) => (
          <li
            key={category.id}
            className="w-fit"
            onClick={() => handleCategories(category.id)}
          >
            <Card category={category} activeCategories={activeCategories} />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CategoryCards;
