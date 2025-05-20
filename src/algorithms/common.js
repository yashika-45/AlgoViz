/**
 * Validates user input for disk operations
 * @param {String} requestsStr - Comma-separated string of request positions
 * @param {String} headPositionStr - Initial head position as string
 * @returns {Object} Validation result with status and message
 */
const validateInput = (requestsStr, headPositionStr) => {
  if (!requestsStr || requestsStr.trim() === '') {
    return { valid: false, message: 'Please enter at least one request position' };
  }
  if (!headPositionStr || headPositionStr.trim() === '') {
    return { valid: false, message: 'Please enter an initial head position' };
  }
  const headPosition = parseInt(headPositionStr, 10);
  const requests = requestsStr.split(',').map(r => parseInt(r.trim(), 10));
  if (isNaN(headPosition)) {
    return { valid: false, message: 'Initial head position must be a number' };
  }
  for (const request of requests) {
    if (isNaN(request)) {
      return { valid: false, message: 'All requests must be valid numbers' };
    }
  }
  const diskSize = 200;
  if (headPosition < 0 || headPosition >= diskSize) {
    return { valid: false, message: `Initial position must be between 0 and ${diskSize - 1}` };
  }
  for (const request of requests) {
    if (request < 0 || request >= diskSize) {
      return { valid: false, message: `All requests must be between 0 and ${diskSize - 1}` };
    }
  }
  
  return { 
    valid: true,
    requests,
    headPosition
  };
};

/**
 * Calculates the total seek time for a sequence of disk accesses
 * @param {Array} sequence - Array of disk positions in access order
 * @returns {Number} Total seek time
 */
const calculateTotalSeekTime = (sequence) => {
  let totalSeekTime = 0;
  for (let i = 1; i < sequence.length; i++) {
    totalSeekTime += Math.abs(sequence[i] - sequence[i - 1]);
  }
  return totalSeekTime;
};

/**
 * Calculates the average seek time
 * @param {Number} totalSeekTime - Total seek time
 * @param {Number} requestCount - Number of requests
 * @returns {Number} Average seek time
 */
const calculateAverageSeekTime = (totalSeekTime, requestCount) => {
  return totalSeekTime / requestCount;
};

export { validateInput, calculateTotalSeekTime, calculateAverageSeekTime }; 