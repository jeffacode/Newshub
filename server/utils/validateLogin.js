function validateLogin(payload) {
  var errors = {};
  let isFormValid = true;
  let message = '';

  if (payload.email && payload.password) {
    if (payload.email.trim().length === 0) {
      isFormValid = false;
      errors.email = 'Please provide your email address.';
    }
  
    if (payload.password.trim().length === 0) {
      isFormValid = false;
      errors.password = 'Please provide your password.';
    }
  
    if (!isFormValid) {
      message = 'Check the form for errors.';
    }
    
    return {
      success: isFormValid,
      message,
      errors,
    };
  }

  return {
    success: false,
    message: 'All fields must be filled.',
  };
}

module.exports = validateLogin;
