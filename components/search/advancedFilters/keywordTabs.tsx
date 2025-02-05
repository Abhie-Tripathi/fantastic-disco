import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface KeywordTabsProps {
  type?:string;
  activeTab: "include" | "exclude";
  setActiveTab: (value: "include" | "exclude") => void;
  handleAddKeyword: (e: React.FormEvent) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  includeKeywords: string[];
  excludeKeywords: string[];
  handleRemoveKeyword: (keyword: string, type: "include" | "exclude") => void;
}

const KeywordTabs: React.FC<KeywordTabsProps> = ({
  type,
  activeTab,
  setActiveTab,
  handleAddKeyword,
  inputValue,
  setInputValue,
  includeKeywords,
  excludeKeywords,
  handleRemoveKeyword,
}) => {
  return (
    <Tabs
      defaultValue="include"
      onValueChange={(value) => setActiveTab(value as "include" | "exclude")}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="include">Include
        </TabsTrigger>
        <TabsTrigger value="exclude">Exclude
        </TabsTrigger>
      </TabsList>
      <div className="space-y-4"   style={{
      padding: type === "T_PRODUCT_KEYWORDS" ? "16px 0px" : "16px",
    }}>
        <form onSubmit={handleAddKeyword} className="flex space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={`Type Products/Topics to ${
                activeTab === "include" ? "include" : "exclude"
              }`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button type="submit" size="sm" className="px-4 text-white text-lg h-auto">
            +
          </Button>
        </form>
        {type!=="T_PRODUCT_KEYWORDS" &&
        <>
        <TabsContent value="include" className="mt-0">
          <div className="flex flex-wrap gap-2">
            {includeKeywords?.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="text-sm py-1 px-2"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword, "include")}
                  className="ml-1 hover:text-destructive"
                  aria-label={`Remove keyword ${keyword}`}
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="exclude" className="mt-0">
          <div className="flex flex-wrap gap-2">
            {excludeKeywords?.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="text-sm py-1 px-2"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword, "exclude")}
                  className="ml-1 hover:text-destructive"
                  aria-label={`Remove keyword ${keyword}`}
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        </TabsContent>
        </>
        } 
      </div>
    </Tabs>
  );
};

export default KeywordTabs;