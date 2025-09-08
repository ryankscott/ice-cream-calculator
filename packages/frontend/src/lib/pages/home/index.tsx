import { IngredientsTable } from "@/lib/components/ingredients-table";

const Home = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 w-full">
      <div className="w-full px-4">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Ice Cream Calculator
        </h1>
        <IngredientsTable />
      </div>
    </div>
  );
};

export default Home;
