import {settings, select} from '../settings.js';
import {utils} from '../utils.js';
import BaseWidget from './BaseWidget.js';

class DatePicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    
    thisWidget.initPlugin();
  }

  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    
 
    /* Init flatpickr plugin */
    const options = {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      locale: {
        firstDayOfWeek: 1 // start week on Monday
      },
      disable: [
        function(date) {
          // return true to disable
          return (date.getDay() === 1);
        }
      ],

      // eslint-disable-next-line no-undef
      onChange: function(selectedDates, dateToStr){     //KL: dateToStr
        
        thisWidget.value = dateToStr;                   //KL: dateToStr
        //console.log(thisWidget.value);
      }
         
    };
    
    // eslint-disable-next-line no-undef
    flatpickr(thisWidget.dom.input, options);

  }

  parseValue(value){
    return value;
  }

  isValid(){
    return true;
  }

  renderValue(){
    
  }

}

export default DatePicker;