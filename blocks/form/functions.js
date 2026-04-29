/**
 * Get Full Name
 * @name getFullName Concats first name and last name
 * @param {string} firstname in Stringformat
 * @param {string} lastname in Stringformat
 * @return {string}
 */
function getFullName(firstname, lastname) {
  return `${firstname} ${lastname}`.trim();
}

/**
 * Custom submit function
 * @param {scope} globals
 */
function submitFormArrayToString(globals) {
  const data = globals.functions.exportData();
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].join(',');
    }
  });
  globals.functions.submitForm(data, true, 'application/json');
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns {number} returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // return zero if dates are valid
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
* Masks the first 5 digits of the mobile number with *
* @param {*} mobileNumber
* @returns {string} returns the mobile number with first 5 digits masked
*/
function maskMobileNumber(mobileNumber) {
  if (!mobileNumber) {
    return '';
  }
  const value = mobileNumber.toString();
  // Mask first 5 digits and keep the rest
  return ` ${'*'.repeat(5)}${value.substring(5)}`;
}

let otpTimerInterval;

/**
 * Start OTP timer - counts down from 30 seconds
 * Disables resend button during countdown
 */
function startOtpTimer() {
  const timerInput = document.querySelector('input[name="timer"]');
  const resendBtn = document.querySelector('.field-resend-otp button');

  let timeLeft = 30;

  // Clear any existing timer
  if (otpTimerInterval) {
    clearInterval(otpTimerInterval);
  }

  // Disable resend button
  if (resendBtn) {
    resendBtn.disabled = true;
  }

  // Set initial timer value
  if (timerInput) {
    timerInput.value = `${timeLeft}s`;
  }

  // Start countdown
  otpTimerInterval = setInterval(() => {
    timeLeft -= 1;

    if (timerInput) {
      timerInput.value = `${timeLeft}s`;
    }

    // When timer reaches 0
    if (timeLeft <= 0) {
      clearInterval(otpTimerInterval);
      
      // Enable resend button
      if (resendBtn) {
        resendBtn.disabled = false;
      }

      if (timerInput) {
        timerInput.value = '0s';
      }
    }
  }, 1000);
}

/**
 * Stop OTP timer
 */
function stopOtpTimer() {
  if (otpTimerInterval) {
    clearInterval(otpTimerInterval);
    otpTimerInterval = null;
  }
}

/**
 * Format number to Indian currency format
 * @param {number} amount
 * @returns {string} formatted currency string
 */
function formatIndianCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/**
 * Calculate EMI (Equated Monthly Installment)
 * @param {number} principal - Loan amount (P)
 * @param {number} annualRate - Annual interest rate in percentage (e.g., 10.97)
 * @param {number} tenureMonths - Loan tenure in months (n)
 * @returns {number} Monthly EMI amount
 */
function calculateEMI(principal, annualRate, tenureMonths) {
  // Convert annual rate to monthly rate (r = annual rate / (12 × 100))
  const monthlyRate = annualRate / (12 * 100);
  
  // EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]
  const onePlusR = 1 + monthlyRate;
  const onePlusRPowerN = Math.pow(onePlusR, tenureMonths);
  
  const emi = (principal * monthlyRate * onePlusRPowerN) / (onePlusRPowerN - 1);
  
  return Math.round(emi);
}

/**
 * Initialize EMI calculator with event listeners
 * Updates EMI amount and loan amount display when user changes the sliders
 */
function initEMICalculator() {
  const loanAmountInput = document.querySelector('input[name="loanAmount"]');
  const loanTenureInput = document.querySelector('input[name="loanTenure"]');
  const xpressField = document.querySelector('input[name="xpress"]');
  const emiAmountField = document.querySelector('input[name="emi_amount"]');
  const loanAmountBubble = document.querySelector('#numberinput-45bf0620a4')?.closest('.range-widget-wrapper')?.querySelector('.range-bubble');
  const tenureBubble = document.querySelector('#numberinput-2a9c496a67')?.closest('.range-widget-wrapper')?.querySelector('.range-bubble');

  if (!loanAmountInput || !loanTenureInput || !xpressField || !emiAmountField) {
    return;
  }

  const annualRate = 10.97; // Fixed rate of interest

  function updateEMICalculation() {
    const loanAmount = parseFloat(loanAmountInput.value) || 775000;
    const tenure = parseFloat(loanTenureInput.value) || 48;

    // Update the loan amount display (xpress field)
    xpressField.value = formatIndianCurrency(loanAmount);

    // Calculate and update EMI
    const emi = calculateEMI(loanAmount, annualRate, tenure);
    emiAmountField.value = formatIndianCurrency(emi);

    // Update range bubbles
    if (loanAmountBubble) {
      loanAmountBubble.textContent = formatIndianCurrency(loanAmount);
    }
    if (tenureBubble) {
      tenureBubble.textContent = `${Math.round(tenure)} months`;
    }
  }

  // Add event listeners
  loanAmountInput.addEventListener('input', updateEMICalculation);
  loanTenureInput.addEventListener('input', updateEMICalculation);

  // Initial calculation
  updateEMICalculation();
}

// eslint-disable-next-line import/prefer-default-export
export {
  getFullName,
  days,
  submitFormArrayToString,
  maskMobileNumber,
  startOtpTimer,
  stopOtpTimer,
  calculateEMI,
  formatIndianCurrency,
  initEMICalculator,
};
