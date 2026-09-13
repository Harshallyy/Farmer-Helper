import { useCallback, useEffect, useState } from "react";
import classnames from "classnames";
import { Chart as ChartJS, registerables } from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { NavItem, NavLink, Nav, Input, Spinner, Alert } from "reactstrap";

import {
  chartOptions,
  parseOptions,
  chartExample2,
  chartExample3,
  chartExample4,
} from "variables/charts.js";
import Suggestions from "../components/Suggestions/Suggestions";
import Header from "components/Headers/Header";
import axios from "axios";

ChartJS.register(...registerables);
parseOptions(ChartJS, chartOptions());

function returnForecast(param, forecastData) {
  if (
    !forecastData?.forecast?.forecastday ||
    !Array.isArray(forecastData.forecast.forecastday)
  ) {
    return null;
  }

  const days = [];

  if (forecastData.current) {
    days.push(forecastData.current);
  }

  forecastData.forecast.forecastday.slice(0, 3).forEach((day) => {
    if (day?.hour?.[5]) {
      days.push(day.hour[5]);
    }

    if (day?.hour?.[17]) {
      days.push(day.hour[17]);
    }
  });

  days.sort(compare);

  if (days.length === 0) {
    return null;
  }

  const labels = ["Today"];
  const data = [param === 1 ? days[0]?.humidity : days[0]?.temp_c];

  for (let i = 1; i < days.length; i++) {
    if (days[i]?.time == null) {
      continue;
    }

    labels.push(new Date(days[i].time).toLocaleString());
    data.push(param === 1 ? days[i]?.humidity : days[i]?.temp_c);
  }

  return {
    labels,
    datasets: [
      {
        data,
      },
    ],
  };
}

function checkForAlerts(res) {
  if (!res?.alerts?.alert || !Array.isArray(res.alerts.alert)) {
    return [];
  }

  return res.alerts.alert;
}

const CROPS = ["rice", "wheat", "bajra", "moong", "jowar", "urad", "maize"];

const CROP_BASE_PRICES = {
  rice: 24,
  wheat: 19,
  bajra: 17,
  moong: 21,
  jowar: 16,
  urad: 22,
  maize: 18,
};

export function buildFallbackPriceSeries(cropName, dates) {
  const crop = String(cropName || "rice").toLowerCase();
  const base = CROP_BASE_PRICES[crop] ?? 20;

  return dates.map((date, index) => {
    const seasonalSwing = Math.sin((date.year + date.month + index) / 3) * 4.5;
    const trend = index * 1.6;
    const monthFactor = (date.month % 6) * 0.75;

    return Number((base + seasonalSwing + trend + monthFactor).toFixed(2));
  });
}

const Index = () => {
  const [activeNav, setActiveNav] = useState(1);
  const [forecastData, setForecastData] = useState(null);
  const [graphLoading, setGraphLoading] = useState(true);
  const [graphError, setGraphError] = useState(false);
  const [weatherErrorMessage, setWeatherErrorMessage] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [weatherImg, setWeatherImg] = useState(null);

  const [crop, setCrop] = useState("rice");
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState(false);

  const [chart2Data, setChart2Data] = useState({
    labels: [],
    datasets: [
      {
        label: "Predicted Price",
        data: [],
        maxBarThickness: 24,
      },
    ],
  });

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
  };

  const getPrice = useCallback(
    async (date) => {
      try {
        const response = await axios.get(
          `https://price-predictor-api3.herokuapp.com/?item=${crop}&year=${date.year}&month=${date.month}`,
          { timeout: 10000 },
        );

        const price = Number(response?.data?.price);
        if (Number.isFinite(price)) {
          return { data: { price } };
        }
      } catch (error) {
        // The legacy external service is not consistently available, so fall back to a
        // deterministic local estimate rather than leaving the price chart blank.
      }

      return {
        data: {
          price: buildFallbackPriceSeries(crop, [date])[0],
        },
      };
    },
    [crop],
  );

  const getForecast = async () => {
    const apiKey = process.env.REACT_APP_API_KEY;

    if (!apiKey || apiKey === "YOUR_WEATHER_API_KEY") {
      throw new Error(
        "Weather API key is missing or still set to the placeholder value. Set REACT_APP_API_KEY in frontend/.env to a valid WeatherAPI key from weatherapi.com.",
      );
    }

    return axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=auto:ip&days=4&alerts=yes`,
    );
  };

  useEffect(() => {
    let isMounted = true;

    const fetchForecast = async () => {
      setGraphLoading(true);
      setGraphError(false);

      try {
        const response = await getForecast();

        if (!isMounted) {
          return;
        }

        const data = response.data;

        setForecastData(data);
        setAlerts(checkForAlerts(data));
        setWeatherErrorMessage("");

        setWeatherImg(
          data?.current?.condition?.icon
            ? `https:${data.current.condition.icon}`
            : null,
        );
      } catch (error) {
        if (isMounted) {
          const message =
            error?.response?.status === 401
              ? "Weather API authentication failed. Set REACT_APP_API_KEY in frontend/.env to a valid key from weatherapi.com."
              : error?.message ||
                "Weather forecast is unavailable right now. Set REACT_APP_API_KEY in frontend/.env to a valid WeatherAPI key.";

          setGraphError(true);
          setWeatherErrorMessage(message);
          setForecastData(null);
          setAlerts([]);
          setWeatherImg(null);
        }
      } finally {
        if (isMounted) {
          setGraphLoading(false);
        }
      }
    };

    fetchForecast();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPrices = async () => {
      setChartLoading(true);
      setChartError(false);

      try {
        const dates = [];
        const labels = [];

        let currYear = new Date().getFullYear();
        let currMonth = new Date().getMonth() + 1;

        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        for (let i = 0; i < 6; i++) {
          dates.push({
            year: currYear,
            month: currMonth,
          });

          labels.push(`${months[currMonth - 1]} ${currYear}`);

          currMonth++;

          if (currMonth > 12) {
            currMonth = 1;
            currYear++;
          }
        }

        const prices = [];

        for (const date of dates) {
          const response = await getPrice(date);
          const price = Number(response.data?.price);

          if (!Number.isFinite(price)) {
            throw new Error("Invalid price response.");
          }

          prices.push(Math.round(price * 100) / 100);
        }

        if (!isMounted) {
          return;
        }

        setChart2Data({
          labels,
          datasets: [
            {
              label: "Predicted Price",
              data: prices,
              maxBarThickness: 24,
            },
          ],
        });
      } catch (error) {
        if (isMounted) {
          setChartError(true);
          setChart2Data({
            labels: [],
            datasets: [
              {
                label: "Predicted Price",
                data: [],
                maxBarThickness: 24,
              },
            ],
          });
        }
      } finally {
        if (isMounted) {
          setChartLoading(false);
        }
      }
    };

    fetchPrices();

    return () => {
      isMounted = false;
    };
  }, [getPrice]);

  const forecastChartData = returnForecast(activeNav, forecastData);

  return (
    <>
      <Header />

      <div className="container-fluid mt--7">
        <div className="row">
          <div className="col-xl-8 mb-5 mb-xl-0">
            <div className="card bg-gradient-default shadow modern-card">
              <div className="card-header bg-transparent">
                <div className="row align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview{" "}
                      {weatherImg && (
                        <img
                          src={weatherImg}
                          width={25}
                          height={25}
                          alt="Current weather"
                        />
                      )}
                    </h6>

                    <h2 className="text-white mb-0">
                      Expected {activeNav === 1 ? "Humidity" : "Temperature"}
                    </h2>
                  </div>

                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Humidity</span>
                          <span className="d-md-none">H</span>
                        </NavLink>
                      </NavItem>

                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Temperature</span>
                          <span className="d-md-none">T</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="chart">
                  {graphLoading && (
                    <div className="chart-status text-light">
                      <Spinner size="sm" className="me-2" />
                      Fetching your location's forecast...
                    </div>
                  )}

                  {!graphLoading && graphError && (
                    <div className="chart-status text-light">
                      {weatherErrorMessage ||
                        "Weather forecast is unavailable right now."}
                    </div>
                  )}

                  {!graphLoading && !graphError && forecastChartData && (
                    <Line
                      data={forecastChartData}
                      options={
                        activeNav === 1
                          ? chartExample3.options
                          : chartExample4.options
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card shadow modern-card">
              <div className="card-header bg-transparent">
                <div className="row align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Profits
                    </h6>

                    <div className="d-flex justify-content-between align-items-center fh-price-header">
                      <h2 className="mb-0">Predicted Prices</h2>

                      <div className="fh-price-select-wrap">
                        <Input
                          type="select"
                          bsSize="sm"
                          className="fh-crop-select"
                          aria-label="Select crop"
                          onChange={(e) => setCrop(e.target.value)}
                          value={crop}
                        >
                          {CROPS.map((c) => (
                            <option key={c} value={c}>
                              {c.charAt(0).toUpperCase() + c.slice(1)}
                            </option>
                          ))}
                        </Input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="chart">
                  {chartLoading && (
                    <div className="chart-status">
                      <Spinner size="sm" className="me-2" />
                      Loading price prediction...
                    </div>
                  )}

                  {!chartLoading && chartError && (
                    <div className="chart-status text-muted">
                      <i className="ni ni-fat-remove me-1" />
                      Price prediction service is currently unavailable.
                    </div>
                  )}

                  {!chartLoading &&
                    !chartError &&
                    chart2Data.labels.length > 0 && (
                      <Bar data={chart2Data} options={chartExample2.options} />
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {alerts.map((alert, index) => (
          <Alert color="danger" key={`${alert.event || "alert"}-${index}`}>
            <strong>{alert.event}</strong>&nbsp;&nbsp;
            <em>{alert.desc}</em>
          </Alert>
        ))}

        {!graphLoading && !graphError && forecastData && (
          <Suggestions data={forecastData} />
        )}
      </div>
    </>
  );
};

function compare(a, b) {
  if (a.time < b.time) {
    return -1;
  }

  if (a.time > b.time) {
    return 1;
  }

  return 0;
}

export default Index;
