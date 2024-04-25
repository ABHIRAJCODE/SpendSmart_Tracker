import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './App.css';

function App() {
  
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const expenseChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    updatePieChart();
    updateLineChart();
  }, [expenses]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    const category = e.target.category.value;
    const amount = Number(e.target.amount.value);
    const date = e.target.date.value;

    if (category === '') {
      alert('Please select a category From the list!!!');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (date === '') {
      alert('Please select a date To Proceed');
      return;
    }

    const newExpense = { category, amount, date };
    setExpenses([...expenses, newExpense]);
    setTotalAmount(totalAmount + amount);
  };

  const handleDeleteExpense = (expense) => {
    const updatedExpenses = expenses.filter(
      (e) => e.category !== expense.category || e.amount !== expense.amount || e.date !== expense.date
    );
    setExpenses(updatedExpenses);
    setTotalAmount(totalAmount - expense.amount);
  };

  const updatePieChart = () => {
    const categoriesData = {};
    expenses.forEach((expense) => {
      if (categoriesData[expense.category]) {
        categoriesData[expense.category] += expense.amount;
      } else {
        categoriesData[expense.category] = expense.amount;
      }
    });

    const chartLabels = Object.keys(categoriesData);
    const chartData = Object.values(categoriesData);

    const pieChartData = {
      labels: chartLabels,
      datasets: [
        {
          data: chartData,
          backgroundColor: chartLabels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
        },
      ],
    };

    const chartOptions = {
      plugins: {
        title: {
          display: true,
          text: 'Expenses by Category',
        },
      },
      cutout: '60%',
    };

    if (window.expensePieChart) {
      window.expensePieChart.data = pieChartData;
      window.expensePieChart.update();
    } else {
      window.expensePieChart = new Chart(expenseChartRef.current.getContext('2d'), {
        type: 'doughnut',
        data: pieChartData,
        options: chartOptions,
      });
    }
  };

  const updateLineChart = () => {
    const monthlyData = {};
    expenses.forEach((expense) => {
      const month = new Date(expense.date).getMonth();
      if (monthlyData[month]) {
        monthlyData[month] += expense.amount;
      } else {
        monthlyData[month] = expense.amount;
      }
    });

    const chartLabels = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(0, i);
      return date.toLocaleString('default', { month: 'short' });
    });
    const chartData = chartLabels.map((_, i) => monthlyData[i] || 0);

    const lineChartData = {
      labels: chartLabels,
      datasets: [
        {
          label: 'Expenses by Month',
          data: chartData,
          borderColor: 'blue',
          backgroundColor: 'white',
        },
      ],
    };

    const chartOptions = {
      plugins: {
        title: {
          display: true,
          text: 'Expenses by Month',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Amount',
          },
          ticks: {
            beginAtZero: true,
          },
        },
      },
    };

    if (window.expenseLineChart) {
      window.expenseLineChart.data = lineChartData;
      window.expenseLineChart.update();
    } else {
      window.expenseLineChart = new Chart(lineChartRef.current.getContext('2d'), {
        type: 'line',
        data: lineChartData,
        options: chartOptions,
      });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`${darkMode ? 'dark-mode' : 'App'}`}>
      <button id="toggle-btn" onClick={toggleDarkMode}>Dark Mode</button>
      <h1 id="h1">SpendSmart Tracker</h1>
      <form onSubmit={handleAddExpense}>
        <div id="row1">
          <div className="innerRow1">
            <label htmlFor="category-select" id="in1">Category:</label>
            <select id="category-select" name="category">
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>
          <div className="innerRow1">
            <label htmlFor="amount-input" id="in1">Amount:</label>
            <input type="number" id="amount-input" name="amount" placeholder="e.g. 1000" />
          </div>
          <div className="innerRow1">
            <label htmlFor="date-input" id="in1">Date:</label>
            <input type="date" id="date-input" name="date" />
          </div>
          <div className="innerRow1">
            <button id="add-btn" type="submit">Add Expense</button>
          </div>
        </div>
      </form>
      <div id="total-expense">Total Expense: Rs.{totalAmount.toFixed(2)}</div>
      <div className="table-con">
        <table id="expense-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.category}</td>
                <td>{expense.amount}</td>
                <td>{expense.date}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteExpense(expense)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">Total:</td>
              <td>{totalAmount}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div id="chart-container">
        <div id="chart">
          <canvas ref={expenseChartRef}></canvas>
        </div>
        <div id="chart">
          <canvas ref={lineChartRef}></canvas>
        </div>
      </div>
    </div>
  );
}

export default App;