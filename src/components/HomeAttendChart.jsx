import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

const HomeAttendChart = () => {
  const [policeData, setPoliceData] = useState([]);
  const [fireData, setFireData] = useState([]);
  const [adminData, setAdminData] = useState([]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  // OPTION
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          padding: 10,
          usePointStyle: true,
          font: {
            size: 15,
            padding: 10,
          },
        },
      },
      tooltop: {
        backgroundColor: "#5D5FEF",
      },
    },
    scales: {
      x: {
        scaleLabel: {
          display: true,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
  };
  const getYearMonth = () => {
    const date = new Date();
    const nowYear = date.getFullYear();
    const nowMonth = date.getMonth() + 1;
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let YearMonth = [];
    for (let i = 0; i <= 5; i++) {
      YearMonth.unshift({ year, month });
      month--;
      if (month === 0) {
        month = 12;
        year = year - 1;
      }
    }
    return { nowYear, nowMonth, YearMonth };
  };

  let tatalpolice = 0;
  let tatalfire = 0;
  let tataladmin = 0;
  let testpolice = 0;
  let testfire = 0;
  let testadmin = 0;

  const ym = getYearMonth().YearMonth;
  const labels = ym.map((label) =>
    label.month < 10 ? `0${label.month}` : label.month
  );
  const fetchData = async (
    year = getYearMonth().nowYear,
    month = getYearMonth().nowMonth
  ) => {
    month = month < 10 ? `0${month}` : month;
    const URL = "https://kimcodi.kr/external_api/dashboard/";

    const tatalPoliceUrl = `${URL}numberOfTotalStudentsByMonth.php?yyyy=${year}&mm=${month}&class=경찰`;
    const tatalFireUrl = `${URL}numberOfTotalStudentsByMonth.php?yyyy=${year}&mm=${month}&class=소방`;
    const tatalAdminUrl = `${URL}numberOfTotalStudentsByMonth.php?yyyy=${year}&mm=${month}&class=행정`;
    const testPoliceUrl = `${URL}numberOfTestedStudentsByMonth.php?yyyy=${year}&mm=${month}&class=경찰`;
    const testFireUrl = `${URL}numberOfTestedStudentsByMonth.php?yyyy=${year}&mm=${month}&class=소방`;
    const testAdminUrl = `${URL}numberOfTestedStudentsByMonth.php?yyyy=${year}&mm=${month}&class=행정`;
    await Promise.all([
      axios.get(tatalPoliceUrl).then((res) => {
        if (res.data.code === "001") {
          tatalpolice = res.data.result[0].STUDENT_COUNT;
        } else {
          return;
        }
      }),
      axios.get(tatalFireUrl).then((res) => {
        if (res.data.code === "001") {
          tatalfire = res.data.result[0].STUDENT_COUNT;
        } else {
          return;
        }
      }),
      axios.get(tatalAdminUrl).then((res) => {
        if (res.data.code === "001") {
          tataladmin = res.data.result[0].STUDENT_COUNT;
        } else {
          return;
        }
      }),
      axios.get(testPoliceUrl).then((res) => {
        if (res.data.code === "001") {
          testpolice = res.data.result[0].STUDENT_COUNT;
        } else {
          return;
        }
      }),
      axios.get(testFireUrl).then((res) => {
        if (res.data.code === "001") {
          testfire = res.data.result[0].STUDENT_COUNT;
        } else {
          return;
        }
      }),
      axios.get(testAdminUrl).then((res) => {
        if (res.data.code === "001") {
          testadmin = res.data.result[0].STUDENT_COUNT;
        } else {
          return;
        }
      }),
    ]);
    //응시율
    let attendPolice = ((testpolice / tatalpolice) * 100).toFixed(1);
    attendPolice = attendPolice === "NaN" ? 0 : attendPolice;
    let attendFire = ((testfire / tatalfire) * 100).toFixed(1);
    attendFire = attendFire === "NaN" ? 0 : attendFire;
    let attendAdmin = ((testadmin / tataladmin) * 100).toFixed(1);
    attendAdmin = attendAdmin === "NaN" ? 0 : attendAdmin;
    return { attendPolice, attendFire, attendAdmin };
  };

  useEffect(() => {
    fetchData();
    ym.map((data) =>
      fetchData(data.year, data.month).then((res) =>
        setPoliceData((data) => [...data, res.attendPolice])
      )
    );
    ym.map((data) =>
      fetchData(data.year, data.month).then((res) =>
        setFireData((data) => [...data, res.attendFire])
      )
    );
    ym.map((data) =>
      fetchData(data.year, data.month).then((res) =>
        setAdminData((data) => [...data, res.attendAdmin])
      )
    );
  }, [policeData, fireData, adminData]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "경찰직",
        data: policeData,
        borderColor: "#21468d",
        backgroundColor: "#21468d",
        pointBorderWidth: 4,
      },
      {
        label: "소방직",
        data: fireData,
        borderColor: "#fd4f3a",
        backgroundColor: "#fd4f3a",
        pointBorderWidth: 4,
      },
      {
        label: "행정직",
        data: adminData,
        borderColor: "#257e0e",
        backgroundColor: "#257e0e",
        pointBorderWidth: 4,
      },
    ],
  };
  return <>{adminData ? <Line data={chartData} options={options} /> : null}</>;
};
export default HomeAttendChart;
