// Currency Converter - Vanilla JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const amountInput = document.getElementById('amount');
  const fromCurrencySelect = document.getElementById('from-currency');
  const toCurrencySelect = document.getElementById('to-currency');
  const swapBtn = document.getElementById('swap-btn');
  const convertBtn = document.getElementById('convert-btn');
  const resultText = document.getElementById('result-text');
  const rateInfo = document.getElementById('rate-info');
  const lastUpdated = document.getElementById('last-updated');
  const currencyGrid = document.getElementById('currency-grid');

  // Exchange rates (hardcoded as fallback, would use API in production)
  const exchangeRates = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.78,
      JPY: 156.7,
      CAD: 1.36,
      AUD: 1.50,
      CHF: 0.89,
      CNY: 7.24,
      INR: 83.2,
      BRL: 5.05,
      RUB: 91.5,
      MXN: 17.2,
      KRW: 1350,
      IDR: 15800,
      TRY: 32.1,
      SAR: 3.75,
      ZAR: 18.5,
      NOK: 10.6,
      SEK: 10.4,
      DKK: 6.88,
      PLN: 3.98,
      THB: 36.5,
      HKD: 7.82,
      SGD: 1.35,
      NZD: 1.64,
      HUF: 360,
      CZK: 23.0,
      ILS: 3.73,
      CLP: 920,
      PHP: 57.5,
      AED: 3.67,
      COP: 3900
  };

  // Popular currencies for quick selection
  const popularCurrencies = [
      { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
      { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
      { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
      { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
      { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
      { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' }
  ];

  // Initialize
  function init() {
      updateLastUpdated();
      populatePopularCurrencies();
      convert();
      
      // Event listeners
      amountInput.addEventListener('input', convert);
      fromCurrencySelect.addEventListener('change', convert);
      toCurrencySelect.addEventListener('change', convert);
      swapBtn.addEventListener('click', swapCurrencies);
      convertBtn.addEventListener('click', convert);
  }

  // Update last updated time
  function updateLastUpdated() {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      lastUpdated.textContent = `Today at ${timeString}`;
  }

  // Populate popular currencies grid
  function populatePopularCurrencies() {
      const baseCurrency = fromCurrencySelect.value;
      
      popularCurrencies.forEach(currency => {
          if (currency.code !== baseCurrency) {
              const rate = calculateRate(baseCurrency, currency.code);
              const currencyItem = document.createElement('div');
              currencyItem.className = 'currency-item';
              currencyItem.innerHTML = `
                  <div class="currency-code">${currency.flag} ${currency.code} - ${currency.name}</div>
                  <div class="currency-value">1 ${baseCurrency} = ${rate.toFixed(4)} ${currency.code}</div>
              `;
              
              // Click to select this currency
              currencyItem.addEventListener('click', () => {
                  toCurrencySelect.value = currency.code;
                  convert();
              });
              
              currencyGrid.appendChild(currencyItem);
          }
      });
  }

  // Calculate exchange rate between two currencies
  function calculateRate(from, to) {
      if (from === to) return 1;
      if (exchangeRates[from] && exchangeRates[to]) {
          return exchangeRates[to] / exchangeRates[from];
      }
      return 0;
  }

  // Main conversion function
  function convert() {
      const amount = parseFloat(amountInput.value) || 0;
      const fromCurrency = fromCurrencySelect.value;
      const toCurrency = toCurrencySelect.value;
      
      if (fromCurrency === toCurrency) {
          resultText.textContent = `${amount.toFixed(2)} ${fromCurrency} = ${amount.toFixed(2)} ${toCurrency}`;
          rateInfo.textContent = `1 ${fromCurrency} = 1 ${toCurrency}`;
          return;
      }
      
      const rate = calculateRate(fromCurrency, toCurrency);
      const convertedAmount = amount * rate;
      
      if (rate > 0) {
          resultText.textContent = `${amount.toFixed(2)} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
          rateInfo.textContent = `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
          
          // Update popular currencies grid
          updatePopularCurrenciesGrid();
      } else {
          resultText.textContent = 'Unable to calculate conversion';
          rateInfo.textContent = 'Please check currency selections';
      }
  }

  // Update popular currencies grid
  function updatePopularCurrenciesGrid() {
      currencyGrid.innerHTML = '';
      populatePopularCurrencies();
  }

  // Swap currencies
  function swapCurrencies() {
      const fromValue = fromCurrencySelect.value;
      const toValue = toCurrencySelect.value;
      
      fromCurrencySelect.value = toValue;
      toCurrencySelect.value = fromValue;
      
      convert();
  }

  // Initialize the converter
  init();
});