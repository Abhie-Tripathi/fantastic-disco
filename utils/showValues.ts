import { showValues as showValuesConfig } from "@/constants/filters";

export const getShowValues = (query: any) => {
  const mappedKeys: string[] = [];

  if(query.audienceSpread){
    mappedKeys.push('audience');
  }

  if(query.maturity){
    mappedKeys.push('advance');
  }

  if(query.estimatedVisitorRangeTag){
    mappedKeys.push('insights');
  }

    // Handle multiple comma-separated values
    const showValues = (query.show as unknown as string)?.split(',').map(value => value.trim()).filter(Boolean);
    
    showValues?.forEach(showValue => {
      // Find which key in showValuesConfig contains the show value
      const showKey = Object.keys(showValuesConfig).find(key => 
        showValuesConfig[key as keyof typeof showValuesConfig].includes(showValue)
      );
      if (showKey && !mappedKeys.includes(showKey)) {
        mappedKeys.push(showKey);
      }
    });
    
    // Set query.show to comma-separated keys if any were found
    if (mappedKeys.length > 0) {
      // Add "basic" to the show values if show already exists and has values
      if (!mappedKeys.includes('basic')) {
        mappedKeys.push('basic');
      }
      return mappedKeys.join(',');
    }
    return undefined;
  
}