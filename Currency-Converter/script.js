// Currency Converter Pro - Enhanced Version
class CurrencyConverter {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.setupEventListeners();
        this.loadCurrencies();
        this.init();
    }

    // DOM Elements
    initializeElements() {
        this.elements = {
            // Input Elements
            amountInput: document.getElementById('amount'),
            fromCurrency: document.getElementById('fromCurrency'),
            toCurrency: document.getElementById('toCurrency'),
            swapBtn: document.getElementById('swapBtn'),
            convertBtn: document.getElementById('convertBtn'),
            reverseBtn: document.getElementById('reverseBtn'),
            clearAmount: document.getElementById('clearAmount'),
 
            // Display Elements
            sourceAmount: document.getElementById('sourceAmount'),
            convertedAmount: document.getElementById('convertedAmount'),
            rateInfo: document.getElementById('rateInfo'),
            updateTime: document.getElementById('updateTime'),
            lastUpdated: document.getElementById('lastUpdated'),
            infoBtn: document.getElementById('infoBtn'),

            // UI Elements
            fromFlag: document.getElementById('fromFlag'),
            toFlag: document.getElementById('toFlag'),
            currencyGrid: document.getElementById('currencyGrid'),
            currencyTableBody: document.getElementById('currencyTableBody'),
            copyResult: document.getElementById('copyResult'),
            themeToggle: document.getElementById('themeToggle'),
            autoConvert: document.getElementById('autoConvert'),
            loadingScreen: document.getElementById('loadingScreen'),
            toast: document.getElementById('toast'),
            toastMessage: document.getElementById('toastMessage'),
            toastClose: document.getElementById('toastClose'),
            historyBtn: document.getElementById('historyBtn'),
            calculatorBtn: document.getElementById('calculatorBtn'),
            alertsBtn: document.getElementById('alertsBtn'),
            newsBtn: document.getElementById('newsBtn')

        };
    }

    // Application State
    initializeState() {
        this.state = {
            currencies: [],
            exchangeRates: {},
            baseCurrency: 'USD',
            amount: 100,
            fromCurrency: 'USD',
            toCurrency: 'EUR',
            theme: localStorage.getItem('theme') || 'light',
            lastUpdate: new Date(),
            favorites: JSON.parse(localStorage.getItem('currencyFavorites')) || ['EUR', 'GBP', 'JPY', 'CAD', 'AUD'],
            conversionHistory: JSON.parse(localStorage.getItem('conversionHistory')) || []
        };
    }

    // Initialize Application
    async init() {
        // Set initial theme
        this.setTheme(this.state.theme);
        
        // Load exchange rates
        await this.loadExchangeRates();
        
        // Populate currency dropdowns
        this.populateCurrencyDropdowns();
        
        // Update UI
        this.updateUI();
        
        // Hide loading screen
        setTimeout(() => {
            this.elements.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                this.elements.loadingScreen.style.display = 'none';
            }, 300);
        }, 1000);
    }

    // Load Currencies Data
    async loadCurrencies() {
        // Comprehensive currency data
        this.state.currencies = [
            { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', country: 'United States' },
            { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', country: 'European Union' },
            { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', country: 'United Kingdom' },
            { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', country: 'Japan' },
            { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', country: 'Canada' },
            { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', country: 'Australia' },
            { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', country: 'Switzerland' },
            { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', country: 'China' },
            { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', country: 'India' },
            { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', country: 'Brazil' },
            { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', country: 'Russia' },
            { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', country: 'Mexico' },
            { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', country: 'South Korea' },
            { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', country: 'Indonesia' },
            { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', country: 'Turkey' },
            { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', country: 'Saudi Arabia' },
            { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', country: 'South Africa' },
            { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', country: 'Norway' },
            { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', country: 'Sweden' },
            { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', country: 'Denmark' },
            { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱', country: 'Poland' },
            { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', country: 'Thailand' },
            { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', country: 'Hong Kong' },
            { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', country: 'Singapore' },
            { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', country: 'New Zealand' },
            { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺', country: 'Hungary' },
            { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿', country: 'Czech Republic' },
            { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱', country: 'Israel' },
            { code: 'CLP', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱', country: 'Chile' },
            { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', country: 'Philippines' },
            { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', country: 'UAE' },
            { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴', country: 'Colombia' }
        ];
    }

    // Load Exchange Rates (with fallback)
    async loadExchangeRates() {
        try {
            // Try to fetch real rates from API
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            
            if (response.ok) {
                const data = await response.json();
                this.state.exchangeRates = data.rates;
                this.state.baseCurrency = data.base;
                this.state.lastUpdate = new Date(data.date);
            } else {
                // Fallback to hardcoded rates
                this.useFallbackRates();
            }
        } catch (error) {
            console.log('Using fallback rates:', error);
            this.useFallbackRates();
        }
        
        this.updateTimeDisplay();
    }

    // Fallback exchange rates
    useFallbackRates() {
        this.state.exchangeRates = {
            USD: 1.0,      EUR: 0.92,     GBP: 0.78,     JPY: 156.7,
            CAD: 1.36,     AUD: 1.50,     CHF: 0.89,     CNY: 7.24,
            INR: 83.2,     BRL: 5.05,     RUB: 91.5,     MXN: 17.2,
            KRW: 1350,     IDR: 15800,    TRY: 32.1,     SAR: 3.75,
            ZAR: 18.5,     NOK: 10.6,     SEK: 10.4,     DKK: 6.88,
            PLN: 3.98,     THB: 36.5,     HKD: 7.82,     SGD: 1.35,
            NZD: 1.64,     HUF: 360,      CZK: 23.0,     ILS: 3.73,
            CLP: 920,      PHP: 57.5,     AED: 3.67,     COP: 3900
        };
        this.state.baseCurrency = 'USD';
        this.state.lastUpdate = new Date();
    }

    // Populate Currency Dropdowns
    populateCurrencyDropdowns() {
        const fromSelect = this.elements.fromCurrency;
        const toSelect = this.elements.toCurrency;
        
        // Clear existing options
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';
        
        // Add currency options
        this.state.currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.code;
            option.textContent = `${currency.code} - ${currency.name}`;
            
            // Clone option for both selects
            fromSelect.appendChild(option.cloneNode(true));
            toSelect.appendChild(option);
        });
        
        // Set default values
        fromSelect.value = this.state.fromCurrency;
        toSelect.value = this.state.toCurrency;
        
        // Update flags
        this.updateCurrencyFlags();
    }

    // Update Currency Flags
    updateCurrencyFlags() {
        const fromCurrency = this.state.currencies.find(c => c.code === this.state.fromCurrency);
        const toCurrency = this.state.currencies.find(c => c.code === this.state.toCurrency);
        
        if (fromCurrency) this.elements.fromFlag.textContent = fromCurrency.flag;
        if (toCurrency) this.elements.toFlag.textContent = toCurrency.flag;
    }

    // Calculate Exchange Rate
    calculateRate(fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return 1;
        
        const fromRate = this.state.exchangeRates[fromCurrency] || 1;
        const toRate = this.state.exchangeRates[toCurrency] || 1;
        
        // Convert via base currency (USD)
        return toRate / fromRate;
    }

    // Format Currency Amount
    formatCurrency(amount, currencyCode) {
        const currency = this.state.currencies.find(c => c.code === currencyCode);
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        return formatter.format(amount);
    }

    // Convert Currency
    convert() {
        // Get input values
        this.state.amount = parseFloat(this.elements.amountInput.value) || 0;
        this.state.fromCurrency = this.elements.fromCurrency.value;
        this.state.toCurrency = this.elements.toCurrency.value;
        
        // Validate amount
        if (this.state.amount < 0) {
            this.showToast('Amount cannot be negative', 'error');
            this.elements.amountInput.value = 0;
            this.state.amount = 0;
        }
        
        // Calculate conversion
        const rate = this.calculateRate(this.state.fromCurrency, this.state.toCurrency);
        const convertedAmount = this.state.amount * rate;
        
        // Update UI
        this.updateDisplay(rate, convertedAmount);
        
        // Update popular conversions grid
        this.updateCurrencyGrid();
        
        // Update currency table
        this.updateCurrencyTable();
        
        // Add to history
        this.addToHistory(rate, convertedAmount);
        
        // Update flags
        this.updateCurrencyFlags();
    }

    // Update Display
    updateDisplay(rate, convertedAmount) {
        // Format amounts
        const sourceFormatted = this.formatCurrency(this.state.amount, this.state.fromCurrency);
        const targetFormatted = this.formatCurrency(convertedAmount, this.state.toCurrency);
        
        // Update elements
        this.elements.sourceAmount.textContent = sourceFormatted;
        this.elements.convertedAmount.textContent = targetFormatted;
        this.elements.rateInfo.textContent = `1 ${this.state.fromCurrency} = ${rate.toFixed(6)} ${this.state.toCurrency}`;
        
        // Update amount input label
        this.elements.amountInput.setAttribute('aria-label', `Amount in ${this.state.fromCurrency}`);
    }

    // Update Popular Conversions Grid
    updateCurrencyGrid() {
        const grid = this.elements.currencyGrid;
        grid.innerHTML = '';
        
        // Get popular currencies (excluding current from currency)
        const popularCurrencies = this.state.currencies
            .filter(currency => 
                this.state.favorites.includes(currency.code) && 
                currency.code !== this.state.fromCurrency
            )
            .slice(0, 6);
        
        // Create grid items
        popularCurrencies.forEach(currency => {
            const rate = this.calculateRate(this.state.fromCurrency, currency.code);
            const convertedAmount = this.state.amount * rate;
            
            const item = document.createElement('div');
            item.className = 'currency-item';
            item.innerHTML = `
                <div class="currency-code">${currency.flag} ${currency.code}</div>
                <div class="currency-value">${this.formatCurrency(convertedAmount, currency.code)}</div>
            `;
            
            // Click to set as target currency
            item.addEventListener('click', () => {
                this.elements.toCurrency.value = currency.code;
                this.convert();
            });
            
            grid.appendChild(item);
        });
    }

    // Update Currency Table
    updateCurrencyTable() {
        const tableBody = this.elements.currencyTableBody;
        tableBody.innerHTML = '';
        
        // Add rows for all currencies
        this.state.currencies.forEach(currency => {
            const rate = this.state.exchangeRates[currency.code] || 0;
            const change = (Math.random() * 2 - 1).toFixed(2); // Simulated change
            const changeClass = change >= 0 ? 'positive' : 'negative';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="currency-cell">
                        <span class="currency-flag">${currency.flag}</span>
                        <span class="currency-name">${currency.name}</span>
                    </div>
                </td>
                <td>${currency.code}</td>
                <td>${rate.toFixed(4)}</td>
                <td class="rate-change ${changeClass}">${change >= 0 ? '+' : ''}${change}%</td>
                <td>${currency.country}</td>
            `;
            
            // Click to set as from currency
            row.addEventListener('click', () => {
                this.elements.fromCurrency.value = currency.code;
                this.convert();
            });
            
            tableBody.appendChild(row);
        });
    }

    // Swap Currencies
    swapCurrencies() {
        const temp = this.state.fromCurrency;
        this.state.fromCurrency = this.state.toCurrency;
        this.state.toCurrency = temp;
        
        // Update selects
        this.elements.fromCurrency.value = this.state.fromCurrency;
        this.elements.toCurrency.value = this.state.toCurrency;
        
        // Convert
        this.convert();
    }

    // Reverse Conversion
    reverseConversion() {
        // Just swap currencies
        this.swapCurrencies();
    }

    // Add to History
    addToHistory(rate, convertedAmount) {
        const conversion = {
            date: new Date().toISOString(),
            from: this.state.fromCurrency,
            to: this.state.toCurrency,
            amount: this.state.amount,
            rate: rate,
            converted: convertedAmount
        };
        
        // Add to beginning of history
        this.state.conversionHistory.unshift(conversion);
        
        // Keep only last 50 conversions
        if (this.state.conversionHistory.length > 50) {
            this.state.conversionHistory.pop();
        }
        
        // Save to localStorage
        localStorage.setItem('conversionHistory', JSON.stringify(this.state.conversionHistory));
    }

    // Copy Result to Clipboard
    copyResultToClipboard() {
        const resultText = `${this.elements.sourceAmount.textContent} = ${this.elements.convertedAmount.textContent}`;
        
        navigator.clipboard.writeText(resultText).then(() => {
            this.showToast('Result copied to clipboard!', 'success');
        }).catch(() => {
            this.showToast('Failed to copy result', 'error');
        });
    }

    // Update Time Display
    updateTimeDisplay() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toLocaleDateString();
        
        this.elements.updateTime.textContent = `${dateString} ${timeString}`;
        this.elements.lastUpdated.textContent = `${dateString} ${timeString}`;
        
        // Update every minute
        setTimeout(() => this.updateTimeDisplay(), 60000);
    }

    // Show Toast Notification
    showToast(message, type = 'info') {
        const toast = this.elements.toast;
        const toastMessage = this.elements.toastMessage;
        const icon = toast.querySelector('i');
        
        // Set message and icon
        toastMessage.textContent = message;
        
        // Set color based on type
        switch (type) {
            case 'success':
                icon.className = 'fas fa-check-circle';
                toast.style.borderLeftColor = '#38b000';
                icon.style.color = '#38b000';
                break;
            case 'error':
                icon.className = 'fas fa-exclamation-circle';
                toast.style.borderLeftColor = '#e63946';
                icon.style.color = '#e63946';
                break;
            case 'warning':
                icon.className = 'fas fa-exclamation-triangle';
                toast.style.borderLeftColor = '#ff9e00';
                icon.style.color = '#ff9e00';
                break;
            default:
                icon.className = 'fas fa-info-circle';
                toast.style.borderLeftColor = '#00b4d8';
                icon.style.color = '#00b4d8';
        }
        
        // Show toast
        toast.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    // Toggle Theme
    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        this.setTheme(this.state.theme);
        localStorage.setItem('theme', this.state.theme);
        
        // Update button icon
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = this.state.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        
        this.showToast(`${this.state.theme.charAt(0).toUpperCase() + this.state.theme.slice(1)} mode activated`);
    }

    // Set Theme
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    // Update UI
    updateUI() {
        this.convert();
        this.updateCurrencyGrid();
        this.updateCurrencyTable();
        this.updateCurrencyFlags();
    }

    // Setup Event Listeners
    setupEventListeners() {
        // Convert on input change
        const comingSoon = (feature) => {
            this.showToast(`${feature} feature coming soon 🚧`, 'warning');
        };
        
        this.elements.historyBtn.addEventListener('click', () => comingSoon('History'));
        this.elements.calculatorBtn.addEventListener('click', () => comingSoon('Calculator'));
        this.elements.alertsBtn.addEventListener('click', () => comingSoon('Rate alerts'));
        this.elements.newsBtn.addEventListener('click', () => comingSoon('Market news'));
        
        // Convert on button click
        this.elements.convertBtn.addEventListener('click', () => this.convert());
        
        // Swap currencies
        this.elements.swapBtn.addEventListener('click', () => this.swapCurrencies());
        this.elements.reverseBtn.addEventListener('click', () => this.reverseConversion());
        
        // Clear amount
        this.elements.clearAmount.addEventListener('click', () => {
            this.elements.amountInput.value = '';
            this.elements.amountInput.focus();
        });

        this.elements.infoBtn.addEventListener('click', () => {
            this.showToast(
                'Rates are indicative only. Data from ExchangeRate API / fallback.',
                'info'
            );
        });
         
        // Copy result
        this.elements.copyResult.addEventListener('click', () => this.copyResultToClipboard());
        
        // Toggle theme
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Auto-convert toggle
        this.elements.autoConvert.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.showToast('Auto-convert enabled');
            }
        });
        
        // Close toast
        this.elements.toastClose.addEventListener('click', () => {
            this.elements.toast.classList.remove('show');
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to convert
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.convert();
            }
            
            // Ctrl/Cmd + S to swap
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.swapCurrencies();
            }
            
            // Ctrl/Cmd + C to copy
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                e.preventDefault();
                this.copyResultToClipboard();
            }
            
            // Escape to clear amount
            if (e.key === 'Escape' && document.activeElement === this.elements.amountInput) {
                this.elements.amountInput.value = '';
                this.convert();
            }
        });
        
        // Form submission prevention
        document.querySelector('form')?.addEventListener('submit', (e) => e.preventDefault());
    }
}

// Initialize the converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const converter = new CurrencyConverter();
    
    // Make converter available globally for debugging
    window.currencyConverter = converter;
});