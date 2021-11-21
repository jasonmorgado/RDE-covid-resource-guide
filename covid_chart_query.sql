SELECT
fips,
date,
daily_cases,
daily_deaths,
daily_recoveries,
total_cases,
total_deaths,
total_recoveries
FROM covid_data
WHERE covid_data.date >= {START_DATE}
AND covid_data.date <= {END_DATE}
AND 1=1
ORDER BY date;
