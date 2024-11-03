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

const AdvancedFilters = () => {
  const [selectedView, setSelectedView] = useState("advancedDetails");

  const handleTabChange = (value: string) => {
    setSelectedView(value);
  };

  return (
    <Tabs
      defaultValue="list"
      value={selectedView}
      onValueChange={handleTabChange}
    >
      <div className="flex justify-center mb-6">
        <div className="flex justify-center">
          <TabsList className="w-[570px] grid grid-cols-3 h-auto">
            <TabsTrigger value="advancedDetails" className="text-base">
              Advanced Details
            </TabsTrigger>
            <TabsTrigger value="insightsAndScores" className=" text-base">
              Insights and Scores
            </TabsTrigger>
            <TabsTrigger value="audienceIntel" className=" text-base">
              Audience Intel
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
      <TabsContent value="advancedDetails">
        <div className="grid grid-cols-5 gap-3 pb-6 border-b">
          <EditionSelector source="search"/>
          <GlobalAndTouringSelector source="search"/>
          <ForecastedStatusSelector source="search"/>
          <FrequencySelector source="search"/>
          <KeywordFilter source="search"/>
        </div>
      </TabsContent>
      <TabsContent value="insightsAndScores">
        <div className="grid grid-cols-5 gap-3 pb-6 border-b">
          <EstimatedVisitorsSelector source="search"/>
          <EstimatedExhibitorsSelector source="search"/>
          <EventAnalyticsSelector source="search"/>
          <EstimatedEconomicImpactSelector />
          <EventRankingSelector source="search"/>
        </div>
      </TabsContent>
      <TabsContent value="audienceIntel">
        <div className="grid grid-cols-5 gap-3 pb-6 border-b">
          <AudienceQualitySelector />
          <ExhibitorQualitySelector />
          <AudienceZoneSatusSelector source="search"/>
          <AudienceDesAndDep source="search"/>
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
