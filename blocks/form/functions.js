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

/**
 * Initialize OTP Verification Timer
 * Handles 30-second countdown timer and resend OTP functionality
 * @param {HTMLElement} element - The OTP verification fieldset element
 */
function initOTPTimer(element) {
  if (!element || !element.classList.contains('field-otp-verification')) {
    return null;
  }

  const timerInput = element.querySelector('input[name="timer"]');
  const resendButton = element.querySelector('button[name="resend_otp"]');
  const attemptMsgInput = element.querySelector('input[name="attempt_msg"]');
  const otpCodeInput = element.querySelector('input[name="otp_code"]');
  const invalidOtpMsgInput = element.querySelector('input[name="invalid_otp_msg"]');

  if (!timerInput || !resendButton) {
    return null;
  }

  let timeLeft = 30;
  let timerInterval = null;
  let attemptsLeft = 3;

  // Initialize attempt message
  if (attemptMsgInput) {
    attemptMsgInput.value = `${attemptsLeft}/3 attempt(s) left`;
  }

  // Function to format time as "XX secs"
  const formatTime = (seconds) => `${seconds} secs`;

  // Function to start the countdown timer
  function startTimer() {
    timeLeft = 30;
    resendButton.disabled = true;

    // Clear any existing interval
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    // Update timer display immediately
    timerInput.value = formatTime(timeLeft);

    timerInterval = setInterval(() => {
      timeLeft -= 1;
      timerInput.value = formatTime(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        resendButton.disabled = false;
      }
    }, 1000);
  }

  // Handle resend OTP button click
  function handleResendOTP() {
    // Clear any error messages
    if (invalidOtpMsgInput) {
      invalidOtpMsgInput.value = '';
    }

    // Clear OTP input
    if (otpCodeInput) {
      otpCodeInput.value = '';
    }

    // Start timer again
    startTimer();

    // Here you would typically make an API call to resend the OTP
    // eslint-disable-next-line no-console
    console.log('Resend OTP requested');
  }

  // Handle OTP input validation
  function validateOTPInput() {
    if (otpCodeInput) {
      // Only allow numbers
      otpCodeInput.value = otpCodeInput.value.replace(/[^0-9]/g, '');

      // Limit to 6 digits
      if (otpCodeInput.value.length > 6) {
        otpCodeInput.value = otpCodeInput.value.slice(0, 6);
      }

      // Clear error message when user starts typing
      if (invalidOtpMsgInput && otpCodeInput.value) {
        invalidOtpMsgInput.value = '';
      }
    }
  }

  // Handle form submission
  function handleOTPSubmit(event) {
    const submitButton = element.querySelector('button[name="otp_submit"]');

    if (!submitButton || event.target !== submitButton) {
      return;
    }

    // Validate OTP length
    if (otpCodeInput && otpCodeInput.value.length !== 6) {
      event.preventDefault();
      if (invalidOtpMsgInput) {
        invalidOtpMsgInput.value = 'Please enter a valid 6-digit OTP';
      }
      return;
    }

    // Here you would typically validate the OTP with your backend
    // For demonstration, we'll simulate an invalid OTP scenario

    // Example: Decrease attempts
    attemptsLeft -= 1;
    if (attemptMsgInput) {
      attemptMsgInput.value = `${attemptsLeft}/3 attempt(s) left`;
    }

    if (attemptsLeft <= 0) {
      if (invalidOtpMsgInput) {
        invalidOtpMsgInput.value = 'Maximum attempts reached. Please try again later.';
      }
      if (submitButton) {
        submitButton.disabled = true;
      }
      if (resendButton) {
        resendButton.disabled = true;
      }
    }
  }

  // Add event listeners
  if (resendButton) {
    resendButton.addEventListener('click', handleResendOTP);
  }

  if (otpCodeInput) {
    otpCodeInput.addEventListener('input', validateOTPInput);

    // Auto-focus on OTP input
    otpCodeInput.focus();
  }

  // Add submit event listener to the form
  const form = element.closest('form');
  if (form) {
    form.addEventListener('click', handleOTPSubmit);
  }

  // Start the initial timer
  startTimer();

  // Cleanup function
  return () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    if (resendButton) {
      resendButton.removeEventListener('click', handleResendOTP);
    }
    if (otpCodeInput) {
      otpCodeInput.removeEventListener('input', validateOTPInput);
    }
    if (form) {
      form.removeEventListener('click', handleOTPSubmit);
    }
  };
}

// eslint-disable-next-line import/prefer-default-export
export {
  getFullName, days, submitFormArrayToString, maskMobileNumber, initOTPTimer,
};
