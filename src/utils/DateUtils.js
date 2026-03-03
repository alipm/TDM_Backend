/**
 * Utility functions for handling date formatting and parsing
 */

class DateUtils {
    /**
     * Parses a date string in MM/DD/YYYY format and converts it to YYYY-MM-DD
     * @param {string} dateString - The date string in MM/DD/YYYY format.
     * @returns {string} - The formatted date in YYYY-MM-DD format.
     */
    static formatDate(dateString) {
      // Check if dateString is in MM/DD/YYYY format
      const dateParts = dateString.split('/');
      
      if (dateParts.length === 3) {
        let [month, day, year] = dateParts;
        // Ensure month and day are always two digits
        month = month.padStart(2, '0');
        day = day.padStart(2, '0');

       // Construct the date in YYYY-MM-DD format
            return `${year}-${month}-${day}`;
      }
      
      throw new Error('Invalid date format. Expected MM/DD/YYYY.');
    }
  
    /**
     * Convert any valid date string to a standardized ISO 8601 date string (YYYY-MM-DD)
     * @param {string} dateString - A date string in any valid format.
     * @returns {string} - The standardized date in YYYY-MM-DD format.
     */
    static toISODate(dateString) {
      const dateObj = new Date(dateString);
  
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date format');
      }
  
      return dateObj.toISOString().split('T')[0];  // Return in YYYY-MM-DD format
    }
  }
  
  export default DateUtils;
  