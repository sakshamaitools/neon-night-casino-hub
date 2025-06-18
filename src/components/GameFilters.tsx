
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface GameFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

const GameFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  categories 
}: GameFiltersProps) => {
  return (
    <div className="mb-12">
      <div className="casino-card p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Search Section */}
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-400" />
              <Input
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-gray-800/50 border-yellow-500/30 text-white focus:border-yellow-400 focus:ring-yellow-400/20 placeholder:text-gray-400 text-lg"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">⌘K</kbd>
              </div>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-2">
              <Filter className="h-5 w-5 text-yellow-400" />
              <span className="text-gray-300 font-semibold">Categories:</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "casino-button text-black border-0 px-4 py-2"
                      : "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400 transition-all duration-200 px-4 py-2"
                  }
                >
                  {category}
                  {selectedCategory === category && (
                    <span className="ml-2 text-xs bg-black/20 px-1 rounded">✓</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameFilters;
