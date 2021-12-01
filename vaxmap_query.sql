SELECT
fips,
SUBSTRING(fips, 1, 2) as state_code,
SUBSTRING(fips, 3, 3) as county_code,
SUM(series_complete_yes) as series_complete,

FROM vaccinedatathings
WHERE vaccinedatathings.date >= {START_DATE}
AND vaccinedatathings.date <= {END_DATE}
GROUP BY fips;
