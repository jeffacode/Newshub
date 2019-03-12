var validator = require('validator');

function validateSignup(payload) {
  var errors = {};
  var isFormValid = true;
  var message = '';

  if (
    payload.email &&
    payload.username &&
    payload.password &&
    payload.confirmPassword
  ) {
    if (!validator.isEmail(payload.email)) {
      isFormValid = false;
      errors.email = 'Please provide a correct email address.';
    }
  
    if (payload.username.trim().length === 0) {
      isFormValid = false;
      errors.username = 'Please provide your username.';
    }
  
    if (payload.password.trim().length < 8) {
      isFormValid = false;
      errors.password = 'Password must have at least 8 characters.';
    }
  
    if (payload.password !== payload.confirmPassword) {
      isFormValid = false;
      errors.confirmPassword = 'Two passwords must be the same.';
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

module.exports = validateSignup;
