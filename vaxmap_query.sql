SELECT
FIPS,
SUBSTRING(FIPS, 1, 2) as state_code,
SUBSTRING(fips, 3, 3) as county_code,
SUM(Series_Complete_Yes) as series_complete

FROM vaccinedatathings
WHERE vaccinedatathings.Date >= {START_DATE}
AND vaccinedatathings.Date <= {END_DATE}
GROUP BY fips;