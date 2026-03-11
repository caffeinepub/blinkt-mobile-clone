import { useState } from 'react';
import { Category } from '../backend';
import CategoryTabs from '../components/CategoryTabs';
import NewsFeed from '../components/NewsFeed';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <NewsFeed category={selectedCategory} />
      </div>
    </div>
  );
}
