const { useState, useMemo } = React;

export function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 156.7
  };

  const convertedAmounts = useMemo(() => {
    const numericAmount = parseFloat(amount) || 0;
    const baseRate = exchangeRates[fromCurrency];
    const result = {};
    
    Object.keys(exchangeRates).forEach(currency => {
      if (baseRate !== 0) {
        result[currency] = numericAmount * (exchangeRates[currency] / baseRate);
      } else {
        result[currency] = 0;
      }
    });
    
    return result;
  }, [amount, fromCurrency]);

  const convertedAmount = convertedAmounts[toCurrency] || 0;

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  return (
    <div className="currency-converter">
      <h1>Currency Converter</h1>
      <div className="converter-form">
        <div className="input-group">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="from">From</label>
          <select id="from" value={fromCurrency} onChange={handleFromCurrencyChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="to">To</label>
          <select id="to" value={toCurrency} onChange={handleToCurrencyChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>
      </div>
      <div className="result">
        <h2>
          {convertedAmount.toFixed(2)} {toCurrency}
        </h2>
      </div>
    </div>
  );
}
