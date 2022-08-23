import { useEffect, useState } from "react";
import moment from "moment";

import Chart from "./Chart";

const DATE_FORMAT = "YYYY-MM-DD";
const API_DATE_FORMAT = "YYYY-MM-DD hh:mm:ss";
const SHORT_DATE_FORMAT = "MM/DD";

const Card = ({ user, logs }) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [userImpression, setUserImpression] = useState(0);
  const [userConversion, setUserConversion] = useState(0);
  const [data, setData] = useState([]);
  const [allDays, setAllDays] = useState([]);
  const [currentUserData, setCurrentUserData] = useState([]);
  const [userConversionsData, setUserConversionsData] = useState([]);
  const [conversionRange, setConversionRange] = useState({});
  const [conversionsByDay, setConversionsByDay] = useState({});

  const getConversionsForCurrentDay = (currentDay, userConversionData) => {
    let conversionCount = 0;

    userConversionData.map((item) => {
      const formattedItemDate = moment(item.time, API_DATE_FORMAT).format(
        DATE_FORMAT
      );

      const isSameDay = moment(formattedItemDate, DATE_FORMAT).isSame(
        moment(currentDay, DATE_FORMAT)
      );

      if (isSameDay) {
        conversionCount++;
      }

      return item;
    });

    return conversionCount;
  };

  useEffect(() => {
    const filterUserData = (logs, userId) => {
      const userData = [];

      logs.map((item) => {
        if (item.user_id === userId) {
          userData.push(item);
        }

        return item;
      });

      setCurrentUserData(userData);

      return userData;
    };

    filterUserData(logs, user.fields.Id);
  }, [user.fields.Id]);

  useEffect(() => {
    let impCount = 0;
    let convCount = 0;
    let totalRevenue = 0;
    const allDates = [];
    const allUserConversionData = [];

    currentUserData.map((item, index) => {
      if (item.type === "impression") {
        impCount++;
      }

      if (item.type === "conversion") {
        convCount++;
        allUserConversionData.push(item);
      }

      totalRevenue = totalRevenue + item.revenue;

      allDates.push(moment(item.time, API_DATE_FORMAT).format(DATE_FORMAT));

      return item;
    });

    allDates.sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    setUserImpression(impCount);
    setUserConversion(convCount);
    setTotalRevenue(totalRevenue);
    setAllDays(new Set(allDates));
    setUserConversionsData(allUserConversionData);
  }, [currentUserData]);

  useEffect(() => {
    let conversionsForAllDays = {};

    allDays.forEach((currentDay) => {
      const conversionsForCurrentDay = getConversionsForCurrentDay(
        currentDay,
        userConversionsData
      );

      conversionsForAllDays = {
        ...conversionsForAllDays,
        [currentDay]: conversionsForCurrentDay
      };
    });

    setConversionsByDay(conversionsForAllDays);
  }, [allDays]);

  useEffect(() => {
    const data = [];

    const getAndSetDataForChart = () => {
      Object.keys(conversionsByDay).map((item) => {
        const dataItem = {
          name: item,
          conversions: conversionsByDay[item]
        };

        data.push(dataItem);

        return item;
      });

      setData(data);
    };

    const getAndSetConversionDateRange = (data) => {
      if (data.length < 1) return;

      const currentDateRange = {
        startDate: moment(data[0]?.name, DATE_FORMAT).format(SHORT_DATE_FORMAT),
        endDate: moment(data[data.length - 1]?.name, DATE_FORMAT).format(
          SHORT_DATE_FORMAT
        )
      };

      setConversionRange(currentDateRange);
    };

    getAndSetDataForChart();
    getAndSetConversionDateRange(data);
  }, [conversionsByDay]);

  return (
    <div className="card">
      <div className="card-top d-flex">
        <div className="avatar">
          {user.fields.avatar ? (
            <img
              src={user.fields.avatar}
              height="60"
              width="60"
              alt={`${user.fields.Name}'s avatar`}
            />
          ) : (
            <div className="name-initials d-flex ">{user.fields.Name[0]}</div>
          )}
        </div>
        <div className="personal-details">
          <h3>{user.fields.Name}</h3>
          <h6>{user.fields.occupation}</h6>
        </div>
      </div>

      <div className="card-bottom d-flex">
        <div className="chart d-flex flex-column">
          <div className="chart-container">
            <Chart data={data} />
          </div>
          <small>
            Conversions {conversionRange.startDate} - {conversionRange.endDate}
          </small>
        </div>
        <div className="stats">
          <div className="stat-item d-flex flex-column">
            <strong className="text-orange">{userImpression}</strong>
            <small>impressions</small>
          </div>
          <div className="stat-item d-flex flex-column">
            <strong className="text-blue">{userConversion}</strong>
            <small>conversions</small>
          </div>
          <div className="stat-total">
            <strong className="text-green">${totalRevenue.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
