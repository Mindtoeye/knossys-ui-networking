
/**
 *
 */
class KConsoleTools {
  
  /**
   *
   */
  getTimestamp () {
    let objToday = new Date();
    let curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours());
    let curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes();
    let curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds();
    let curMeridiem = objToday.getHours() > 12 ? "pm" : "am";
    let today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem;

    return (today);
  }

  /**
   *
   */
  getTimestampFull () {
    let objToday = new Date();
    let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dayOfWeek = weekday[objToday.getDay()];
    let domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 === a ? "st" : 2 === a ? "nd" : 3 === a ? "rd" : "th" }();
    let dayOfMonth = (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder;
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let curMonth = months[objToday.getMonth()];
    let curYear = objToday.getFullYear();
    let curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours());
    let curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes();
    let curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds();
    let curMeridiem = objToday.getHours() > 12 ? "pm" : "am";
    let today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;

    return (today);
  }  

  /**
   *
   */
  getDayStamp () {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let timestamp = mm + '/' + dd + '/' + yyyy;
  
    return (timestamp);
  }
}

export default KConsoleTools;