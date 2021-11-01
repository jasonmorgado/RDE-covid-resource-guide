UPDATE covid_data SET daily_cases = (
  ISNULL((
    SELECT SUM(total_cases)
    FROM covid_data today_data
    WHERE today_data.fips = covid_data.fips
    AND today_data.date = covid_data.date
  ), 0) -
  ISNULL((
    SELECT SUM(total_cases)
    FROM covid_data yesterday_data
    WHERE yesterday_data.fips = covid_data.fips
    AND yesterday_data.date = DATEADD(DAY, -1, covid_data.date)
  ), 0)
);

UPDATE covid_data SET daily_deaths = (
  ISNULL((
    SELECT SUM(total_deaths)
    FROM covid_data today_data
    WHERE today_data.fips = covid_data.fips
    AND today_data.date = covid_data.date
  ), 0) -
  ISNULL((
    SELECT SUM(total_deaths)
    FROM covid_data yesterday_data
    WHERE yesterday_data.fips = covid_data.fips
    AND yesterday_data.date = DATEADD(DAY, -1, covid_data.date)
  ), 0)
);

UPDATE covid_data SET total_recoveries = (
  ISNULL(
    (
      SELECT SUM(total_cases)
      FROM covid_data old_data
      WHERE old_data.fips = covid_data.fips
      AND old_data.date = DATEADD(DAY, -14, covid_data.date)
    ) -
    (
      SELECT SUM(total_deaths)
      FROM covid_data today_data
      WHERE today_data.fips = covid_data.fips
      AND today_data.date = covid_data.date
    )
  , 0)
);

UPDATE covid_data SET total_recoveries = 0
WHERE total_recoveries < 0;

UPDATE covid_data SET daily_recoveries = (
  ISNULL(
    (
      SELECT SUM(total_recoveries)
      FROM covid_data today_data
      WHERE today_data.fips = covid_data.fips
      AND today_data.date = covid_data.date
    ) -
    (
      SELECT SUM(total_recoveries)
      FROM covid_data yesterday_data
      WHERE yesterday_data.fips = covid_data.fips
      AND yesterday_data.date = DATEADD(DAY, -1, covid_data.date)
    )
  , 0)
);
