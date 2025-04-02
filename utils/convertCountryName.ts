import CountryNames from "@/data/countryNamesWithISO.json";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

export function getCountryName(isoCode: string): string | undefined {
  const newISOCode = getUpdatedCountryISOCode(isoCode);
  const countryName = CountryNames.find(
    (countryName) => countryName.code === newISOCode
  )?.name;
  return countryName;
}

export function getUpdatedCountryISOCode(isoCode: string): string | undefined {
  countries.registerLocale(en);
  return countries.getAlpha2Code(isoCode, "en") || isoCode;
}
