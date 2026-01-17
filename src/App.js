import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const API = "http://127.0.0.1:8000/api";

function App() {
  const [status, setStatus] = useState("Checking backend...");
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axios.get(`${API}/summary/`)
      .then(() => setStatus("Backend Connected "))
      .catch(() => setStatus("Backend Not Connected "));
  }, []);

  const addIncome = async () => {
    await axios.post(`${API}/income/`, { source, amount });
    alert("Income Added");
  };

  const addExpense = async () => {
    await axios.post(`${API}/expense/`, {
      category,
      amount: expenseAmount
    });
    alert("Expense Added");
  };

  const getProfit = async () => {
    const res = await axios.get(`${API}/summary/`, {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    setSummary(res.data);
  };

  const chartData = summary && {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [summary.total_income, summary.total_expense],
        backgroundColor: ["#4CAF50", "#F44336"]
      }
    ]
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}> Profit Calculator</h1>
      <p>{status}</p>

      <div style={styles.card}>
        <h2> Add Income</h2>
        <input style={styles.input} placeholder="Source" onChange={e => setSource(e.target.value)} />
        <input style={styles.input} type="number" placeholder="Amount" onChange={e => setAmount(e.target.value)} />
        <button style={styles.button} onClick={addIncome}>Add Income</button>
      </div>

      <div style={styles.card}>
        <h2> Add Expense</h2>
        <input style={styles.input} placeholder="Category" onChange={e => setCategory(e.target.value)} />
        <input style={styles.input} type="number" placeholder="Amount" onChange={e => setExpenseAmount(e.target.value)} />
        <button style={styles.buttonRed} onClick={addExpense}>Add Expense</button>
      </div>

      <div style={styles.card}>
        <h2> Profit by Date Range</h2>
        <input style={styles.input} type="date" onChange={e => setStartDate(e.target.value)} />
        <input style={styles.input} type="date" onChange={e => setEndDate(e.target.value)} />
        <button style={styles.buttonBlue} onClick={getProfit}>Show Profit</button>
      </div>

      {summary && (
        <div style={styles.card}>
          <h2> Summary</h2>
          <p>Total Income: ₹{summary.total_income}</p>
          <p>Total Expense: ₹{summary.total_expense}</p>
          <h3 style={{ color: summary.profit >= 0 ? "green" : "red" }}>
            Profit: ₹{summary.profit}
          </h3>

          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  heading: {
    textAlign: "center",
    color: "#333"
  },
  card: {
    background: "#f9f9f9",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px"
  },
  button: {
    background: "#4CAF50",
    color: "white",
    padding: "10px",
    border: "none",
    width: "100%"
  },
  buttonRed: {
    background: "#F44336",
    color: "white",
    padding: "10px",
    border: "none",
    width: "100%"
  },
  buttonBlue: {
    background: "#2196F3",
    color: "white",
    padding: "10px",
    border: "none",
    width: "100%"
  }
};

export default App;
