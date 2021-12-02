SELECT
FIPS,
SUBSTRING(FIPS, 1, 2) as state_code,
SUBSTRING(fips, 3, 3) as county_code,
SUM(series_complete) as series_complete

FROM vaccineData
WHERE vaccineData.Date >= {START_DATE}
AND vaccineData.Date <= {END_DATE}
GROUP BY fips;