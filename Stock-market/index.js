import createChart, { stocksChart } from './chart.js';

let selectedStock = 'AAPL';
let selectedTime = '1y';

const getStocks = async () => {
  const response = await fetch(
    'https://stocks3.onrender.com/api/stocks/getstocksdata'
  );
  const stocksData = await response.json();

  return stocksData['stocksData'][0];
};

const getSummary = async () => {
  const response = await fetch(
    'https://stocks3.onrender.com/api/stocks/getstocksprofiledata'
  );
  const stockSummary = await response.json();

  return stockSummary['stocksProfileData'][0];
};

const getAndSetSummary = () => {
  getSummary().then((summaryData) => {
    document.getElementById('stockName').innerHTML = selectedStock;
    document.getElementById('summary').innerHTML =
      summaryData[selectedStock].summary;
  });
};

const getBookAndProfitValue = async () => {
  const response = await fetch(
    'https://stocks3.onrender.com/api/stocks/getstockstatsdata'
  );
  const bookAndProfitValue = await response.json();

  return bookAndProfitValue['stocksStatsData'][0];
};

getStocks().then((data) => {
  const stocksList = Object.keys(data);
  stocksList.shift();

  getAndSetSummary();
  getBookAndProfitOfStock();

  const stockButtonsContainer = document.getElementById('stockButtons');

  // create stocks buttons
  stocksList.forEach((stock) => {
    const stockContainer = document.createElement('div');
    stockContainer.id = `${stock.toLowerCase()}-container`;

    const button = document.createElement('button');
    button.innerHTML = stock;
    button.id = stock.toLowerCase();

    stockContainer.appendChild(button);

    stockButtonsContainer.appendChild(stockContainer);
  });

  const populateDatasets = (stock, timePeriod) => {
    const timeStamps = data[stock][timePeriod].timeStamp;
    const values = data[stock][timePeriod].value;

    const requiredData = timeStamps.map((timeStamp, index) => {
      const date = new Date(timeStamp * 1000);
      return { x: date.toLocaleDateString(), y: values[index] };
    });

    const datasets = [
      {
        data: requiredData,
        label: stock,
      },
    ];

    return datasets;
  };

  const dataColumn = {
    datasets: populateDatasets(selectedStock, selectedTime),
  };

  createChart(dataColumn);

  // update the chart if stock or time are changed
  const updateChartData = () => {
    dataColumn.datasets = populateDatasets(selectedStock, selectedTime);
    stocksChart.update();
  };

  // create time period buttons
  const timePeriods = ['1mo', '3mo', '1y', '5y'];
  timePeriods.forEach((timePeriod) => {
    const button = document.createElement('button');
    button.innerHTML = timePeriod;
    button.id = timePeriod;
    document.getElementById('timeButtons').appendChild(button);
  });

  // update chart by time period
  timePeriods.forEach((timePeriod) => {
    document.getElementById(timePeriod).addEventListener('click', function () {
      if (selectedTime !== timePeriod) {
        selectedTime = timePeriod;
        updateChartData();
      }
    });
  });

  // update chart by stock name
  stocksList.forEach((stock) => {
    document
      .getElementById(stock.toLowerCase())
      .addEventListener('click', function () {
        if (selectedStock !== stock) {
          selectedStock = stock;
          updateChartData();
          getAndSetSummary();
          getBookAndProfitOfStock();
        }
      });
  });

  getBookAndProfitValue().then((bookAndProfitData) => {
    const stocksList = Object.keys(bookAndProfitData);
    stocksList.pop();

    stocksList.forEach((stock) => {
      const id = `${stock.toLowerCase()}-container`;

      const bookValueContainer = document.createElement('p');
      bookValueContainer.className = 'bookValue';
      bookValueContainer.innerHTML = `$${bookAndProfitData[stock]['bookValue']
        .toFixed(2)
        .toString()}`;
      document.getElementById(id).appendChild(bookValueContainer);

      const profitValueContainer = document.createElement('p');
      profitValueContainer.className = 'profitValue';
      profitValueContainer.innerHTML = `${bookAndProfitData[stock]['profit']
        .toFixed(2)
        .toString()}%`;
      document.getElementById(id).appendChild(profitValueContainer);
      profitValueContainer.style.color = 'red';
      if (bookAndProfitData[stock]['profit'] > 0) {
        profitValueContainer.style.color = 'rgb(0,255,0)';
      }
    });
  });
});

function getBookAndProfitOfStock() {
  const summaryHeader = document.getElementById('summaryHeader');

  const removedBookValue = document.getElementById('summaryBookValue');
  if (removedBookValue) {
    summaryHeader.removeChild(removedBookValue);
  }

  const removedProfitValue = document.getElementById('summaryProfitValue');
  if (removedProfitValue) {
    summaryHeader.removeChild(removedProfitValue);
  }

  const bookValue = document.createElement('p');
  bookValue.id = 'summaryBookValue';

  const profitValue = document.createElement('p');
  profitValue.id = 'summaryProfitValue';

  getBookAndProfitValue().then((bookAndProfitData) => {
    bookValue.innerHTML = `$${bookAndProfitData[selectedStock]['bookValue']
      .toFixed(3)
      .toString()}`;
    profitValue.innerHTML = `${bookAndProfitData[selectedStock]['profit']
      .toFixed(3)
      .toString()}%`;

    profitValue.style.color = 'red';
    if (bookAndProfitData[selectedStock]['profit'] > 0) {
      profitValue.style.color = 'rgb(0,255,0)';
    }

    summaryHeader.appendChild(profitValue);
    summaryHeader.appendChild(bookValue);
  });
}

// Function to toggle dark mode
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');

  // Store the mode in local storage
  const isDarkMode = body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
}

const darkModeToggle = document.getElementById('darkModeToggle');

// Check if dark mode is enabled in local storage
const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
if (darkModeEnabled) {
  darkModeToggle.checked = true;
  document.body.classList.add('dark-mode');
}

// Add event listener to the toggle switch
darkModeToggle.addEventListener('change', toggleDarkMode);
