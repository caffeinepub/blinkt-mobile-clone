import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Category } from '../backend';

interface CategoryTabsProps {
  selectedCategory: Category | null;
  onCategoryChange: (category: Category | null) => void;
}

const categories: { value: Category | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: Category.technology, label: 'Technology' },
  { value: Category.business, label: 'Business' },
  { value: Category.sports, label: 'Sports' },
  { value: Category.entertainment, label: 'Entertainment' },
  { value: Category.general, label: 'General' },
];

export default function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <Tabs value={selectedCategory || 'all'} onValueChange={(value) => onCategoryChange(value === 'all' ? null : (value as Category))}>
          <TabsList className="h-12 w-full justify-start overflow-x-auto rounded-none border-0 bg-transparent p-0">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.value || 'all'}
                value={cat.value || 'all'}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
