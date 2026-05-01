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

/**
 * Map form field values to review section fields
 * This function collects values from various form sections and populates the review section
 */
function mapFormFieldsToReview() {
  // Helper function to get field value by name
  const getFieldValue = (fieldName) => {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return '';
    
    // Handle radio buttons
    if (field.type === 'radio') {
      const checkedRadio = document.querySelector(`[name="${fieldName}"]:checked`);
      return checkedRadio ? checkedRadio.value : '';
    }
    
    return field.value || '';
  };

  // Helper function to set field value by name
  const setFieldValue = (fieldName, value) => {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.value = value;
    }
  };

  // Helper function to get radio button label text
  const getRadioLabelText = (fieldName) => {
    const checkedRadio = document.querySelector(`[name="${fieldName}"]:checked`);
    if (!checkedRadio) return '';
    
    const label = document.querySelector(`label[for="${checkedRadio.id}"]`);
    return label ? label.textContent.trim() : '';
  };

  // 1. Map Loan Details
  const loanAmount = getFieldValue('loanAmount');
  const emiAmount = getFieldValue('emi_amount');
  const loanTenure = getFieldValue('loanTenure');
  const taxes = getFieldValue('taxes');
  const roi = getFieldValue('roi');
  const selectLoanType = getFieldValue('select_loan_type');
  const employerCompanyName = getFieldValue('enter_employer_company_name') || getFieldValue('employer_company_name');

  setFieldValue('loan_amount', loanAmount ? formatIndianCurrency(parseFloat(loanAmount)) : '');
  // EMI amount field has two instances - map to the review section one
  const reviewEmiField = document.querySelector('#panelcontainer-f23c45ef23 input[name="emi_amount"]');
  if (reviewEmiField) {
    reviewEmiField.value = emiAmount;
  }
  setFieldValue('tenure', loanTenure ? `${Math.round(parseFloat(loanTenure))} months` : '');
  setFieldValue('processing_fee', taxes);
  setFieldValue('rate_of_interest', roi);
  setFieldValue('employer_name', employerCompanyName);
  setFieldValue('type_of_loan', selectLoanType);

  // 2. Map Personal Details
  const firstName = getFieldValue('first_name_pan');
  const middleName = getFieldValue('middle_name_pan');
  const lastName = getFieldValue('last_name_pan');
  const fullName = [firstName, middleName, lastName].filter(n => n).join(' ').trim();
  const panNumber = getFieldValue('pan_number');
  const addressAadhaar = getFieldValue('address_as_per_aadhaar_records');
  
  // Get mobile number and DOB from the initial personal loan offer panel
  const mobileNumber = getFieldValue('aadhaar_linked_mobile_number');
  const dateOfBirth = getFieldValue('date_of_birth');

  setFieldValue('full_name', fullName);
  setFieldValue('pan', panNumber);
  setFieldValue('current_address', addressAadhaar);
  
  // Map mobile number and date of birth to review section
  const reviewMobileField = document.querySelector('#panelcontainer-b7a1f38e30 input[name="mobile_number"]');
  if (reviewMobileField) {
    reviewMobileField.value = mobileNumber;
  }
  
  const reviewDobField = document.querySelector('#panelcontainer-b7a1f38e30 input[name="date_of_birth"]');
  if (reviewDobField) {
    // Get the display value if it exists (for formatted dates)
    const dobInput = document.querySelector('input[name="date_of_birth"]');
    const displayValue = dobInput?.getAttribute('display-value') || dateOfBirth;
    reviewDobField.value = displayValue;
    reviewDobField.setAttribute('display-value', displayValue);
    reviewDobField.setAttribute('edit-value', dateOfBirth);
  }

  // 3. Map Salary Account Details
  const accountNumber = getFieldValue('account_number');
  const bankIfsc = getFieldValue('bank_ifsc');
  const salaryBank = getRadioLabelText('salary_bank');
  const otherBank = getFieldValue('other_bank');
  const bankName = otherBank || salaryBank;

  setFieldValue('salary_a_c_number', accountNumber);
  setFieldValue('ifsc', bankIfsc);
  setFieldValue('bank_name', bankName);

  // 4. Map Office Address
  const industryType = getFieldValue('industry_type');
  const officeAddress = getFieldValue('office_address');

  setFieldValue('company_name', employerCompanyName);
  // Industry type field has two instances - map to the review section one
  const reviewIndustryField = document.querySelector('#panelcontainer-a8efdc8bf0 input[name="industry_type"]');
  if (reviewIndustryField) {
    reviewIndustryField.value = industryType;
  }
  setFieldValue('current_employer_address', officeAddress);

  // 5. Map Verify Email ID
  const personalEmailId = getFieldValue('email_id');
  const workEmailId = getFieldValue('enter_email_id');

  setFieldValue('personal_email_id', personalEmailId);
  setFieldValue('work_email_id', workEmailId);

  // Note: Schedule of Charges field is not present in the source fields and may need to be populated separately
}

/**
 * Initialize form field mapping
 * Sets up event listeners to automatically update review section when fields change
 */
function initFormFieldMapping() {
  // List of fields to monitor for changes
  const fieldsToMonitor = [
    'loanAmount', 'loanTenure', 'emi_amount', 'taxes', 'roi',
    'first_name_pan', 'middle_name_pan', 'last_name_pan',
    'pan_number', 'email_id', 'address_as_per_aadhaar_records',
    'salary_bank', 'other_bank', 'account_number', 'bank_ifsc',
    'enter_employer_company_name', 'employer_company_name',
    'industry_type', 'office_address', 'enter_email_id',
    'select_loan_type', 'aadhaar_linked_mobile_number', 'date_of_birth'
  ];

  // Add change event listeners to all monitored fields
  fieldsToMonitor.forEach(fieldName => {
    const fields = document.querySelectorAll(`[name="${fieldName}"]`);
    fields.forEach(field => {
      const eventType = field.type === 'radio' ? 'change' : 'input';
      field.addEventListener(eventType, () => {
        // Debounce to avoid too many updates
        setTimeout(mapFormFieldsToReview, 100);
      });
    });
  });

  // Also trigger mapping when the "Proceed >" button is clicked
  const proceedButton = document.querySelector('#button-1ea1fad0a7');
  if (proceedButton) {
    proceedButton.addEventListener('click', mapFormFieldsToReview);
  }

  // Initial mapping
  mapFormFieldsToReview();
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
  mapFormFieldsToReview,
  initFormFieldMapping,
};
