import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditionSelector from "./advancedFilters/edition";
import ForecastedStatusSelector from "./advancedFilters/forecastedStatus";
import FrequencySelector from "./advancedFilters/frequency";
import GlobalAndTouringSelector from "./advancedFilters/globalAndTouring";
import EstimatedVisitorsSelector from "./advancedFilters/estimatedVisitors";
import EstimatedExhibitorsSelector from "./advancedFilters/estimatedExhibitors";
import EventAnalyticsSelector from "./advancedFilters/eventAnalytics";
import EstimatedEconomicImpactSelector from "./advancedFilters/estimatedEconomicImpact";
import EventRankingSelector from "./advancedFilters/eventRanking";
import TrackerLinks from "./advancedFilters/trackerLinks";
import AudienceQualitySelector from "./advancedFilters/audienceQualityScores";
import ExhibitorQualitySelector from "./advancedFilters/exhibitorQualityScores";
import AudienceDesAndDep from "./advancedFilters/audienceDes&Dep";
import AudienceSpread from "./advancedFilters/audienceSpread";
import KeywordFilter from "./advancedFilters/product&Topics";
import AudienceZoneSatusSelector from "./advancedFilters/audienceZone";
import { isEventeli } from "@/config";
import { cn } from "@/lib/utils";
import { useFilterContext } from "@/context/filterContext";
// import enabledFilters from "@/public/data/enabledFilters";
import { Badge } from "@/components/ui/badge";

const AdvancedFilters = () => {
  const [selectedView, setSelectedView] = useState("advancedDetails");
  const { localFilters } = useFilterContext();
  const handleTabChange = (value: string) => {
    setSelectedView(value);
  };
  const advancedDetailsFiltersCount = (function () {
    let count = 0;
    if (
      localFilters.onlyBranded === "true" ||
      localFilters.onlySeries === "true"
    )
      count++;
    if (localFilters.frequencies) count++;
    if (localFilters.includeKeywords || localFilters.excludeKeywords) count++;
    if (localFilters.maturity) count++;
    return count;
  })();

  const insightsAndScoresFiltersCount = (function () {
    let count = 0;
    if (localFilters.estimatedVisitors) count++;
    if (localFilters.impact_score_gte) count++;
    if (localFilters.top) count++;
    return count;
  })();

  const audienceInterFiltersCount = (function () {
    let count = 0;
    if (localFilters.designations) count++;
    if (localFilters.audienceSpread) count++;
    return count;
  })();
  return (
    <Tabs
      defaultValue="list"
      value={selectedView}
      onValueChange={handleTabChange}
    >
      <div className="flex justify-center my-6">
        <div className="flex justify-center">
          <TabsList
            className={cn(
              "w-[570px] grid grid-cols-3 h-auto",
              isEventeli ? "grid-cols-2 w-[386px]" : ""
            )}
          >
            <TabsTrigger value="advancedDetails" className="text-base">
              Advanced Details
              {advancedDetailsFiltersCount ? (
                <Badge className="ml-2">{advancedDetailsFiltersCount}</Badge>
              ) : (
                ""
              )}
            </TabsTrigger>
            <TabsTrigger value="insightsAndScores" className=" text-base">
              Insights and Scores
              {insightsAndScoresFiltersCount ? (
                <Badge className="ml-2">{insightsAndScoresFiltersCount}</Badge>
              ) : (
                ""
              )}
            </TabsTrigger>
            {!isEventeli && (
              <TabsTrigger value="audienceIntel" className=" text-base">
                Audience Intel
                {audienceInterFiltersCount ? (
                  <Badge className="ml-2">{audienceInterFiltersCount}</Badge>
                ) : (
                  ""
                )}
              </TabsTrigger>
            )}
          </TabsList>
        </div>
      </div>
      <TabsContent value="advancedDetails">
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 pb-6 border-b">
          <EditionSelector />
          <GlobalAndTouringSelector />
          <ForecastedStatusSelector />
          <FrequencySelector />
          <KeywordFilter />
        </div>
      </TabsContent>
      <TabsContent value="insightsAndScores">
        <div
          className={cn("grid grid-cols-3 lg:grid-cols-5 gap-3 pb-6 border-b", {
            "grid-cols-3": isEventeli,
          })}
        >
          <EstimatedVisitorsSelector />
          {!isEventeli && <EstimatedExhibitorsSelector />}
          <EventAnalyticsSelector />
          <EstimatedEconomicImpactSelector />
          <EventRankingSelector />
        </div>
      </TabsContent>
      <TabsContent value="audienceIntel">
        <div
          className={cn("grid grid-cols-3 lg:grid-cols-5 gap-3 pb-6 border-b")}
        >
          <AudienceQualitySelector />
          <ExhibitorQualitySelector />
          {!isEventeli && <AudienceZoneSatusSelector />}
          <AudienceDesAndDep />
          <AudienceSpread />
        </div>
      </TabsContent>
      <TabsContent value="trackers">
        <TrackerLinks />
      </TabsContent>
    </Tabs>
  );
};

export default AdvancedFilters;
