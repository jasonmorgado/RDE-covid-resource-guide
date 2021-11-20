SELECT
fips,
SUM(daily_cases) as sum_cases,
SUM(daily_deaths) as sum_deaths,
SUM(daily_recoveries) as sum_recoveries

FROM covid_data
WHERE covid_data.date >= {START_DATE}
AND covid_data.date <= {END_DATE}
AND 1=1
GROUP BY fips;
