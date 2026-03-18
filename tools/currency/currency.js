/**
 * Currency Converter - Main Logic
 */

// Exchange rates (relative to USD - approximate values)
const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    RUB: 92.50,
    KZT: 450.00,
    GBP: 0.79,
    JPY: 149.50,
    CNY: 7.24,
    TRY: 32.50,
    UAH: 37.50,
    BYN: 3.28
};

const currencyNames = {
    USD: 'Доллар США',
    EUR: 'Евро',
    RUB: 'Рубль',
    KZT: 'Тенге',
    GBP: 'Фунт',
    JPY: 'Иена',
    CNY: 'Юань',
    TRY: 'Лира',
    UAH: 'Гривна',
    BYN: 'Бел. рубль'
};

document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const resultInput = document.getElementById('result');
    const swapBtn = document.getElementById('swapBtn');
    const rateInfo = document.getElementById('rateInfo');
    const currencyGrid = document.getElementById('currencyGrid');

    // Convert currency
    function convert() {
        const amount = parseFloat(amountInput.value) || 0;
        const from = fromSelect.value;
        const to = toSelect.value;

        // Convert through USD (base currency)
        const usdAmount = amount / exchangeRates[from];
        const result = usdAmount * exchangeRates[to];

        resultInput.value = result.toFixed(2);

        // Update rate info
        const rate = exchangeRates[to] / exchangeRates[from];
        rateInfo.innerHTML = `<span>1 ${from} = ${rate.toFixed(4)} ${to}</span>`;

        // Update quick conversion grid
        updateQuickGrid(amount, from);
    }

    // Update quick conversion grid
    function updateQuickGrid(amount, from) {
        const currencies = Object.keys(exchangeRates).filter(c => c !== from);
        
        currencyGrid.innerHTML = currencies.map(currency => {
            const usdAmount = amount / exchangeRates[from];
            const value = usdAmount * exchangeRates[currency];
            return `
                <div class="currency-card">
                    <div class="code">${currency}</div>
                    <div class="value">${value.toFixed(2)}</div>
                </div>
            `;
        }).join('');
    }

    // Event listeners
    amountInput.addEventListener('input', convert);
    fromSelect.addEventListener('change', convert);
    toSelect.addEventListener('change', convert);

    swapBtn.addEventListener('click', () => {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
        convert();
    });

    // Initial conversion
    convert();
});
