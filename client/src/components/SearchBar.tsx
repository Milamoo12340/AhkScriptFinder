import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, onSearch, placeholder = "Search for AutoHotkey macros..." }: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-7 w-7 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-14 h-24 text-xl font-medium"
          data-testid="input-search"
        />
      </div>
      <Button 
        onClick={onSearch}
        size="lg"
        className="h-24 px-10 text-xl font-semibold"
        data-testid="button-search"
      >
        Search
      </Button>
    </div>
  );
}