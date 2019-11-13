import AmountWidget from "./AmountWidget";


class Booking{
    constructor(){
        thisBooking = this;

        thisBooking.render(thisApp.bookingWidget);
        thisBooking.initWidgets();
    }
    
    render(element){
        thisBooking = this;

        const generatedHTML = templates.bookingWidget();

        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;

        thisBooking.element = utils.createDOMFromHTML(generatedHTML);

        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    }

    initWidgets(){
        thisBooking = this;

        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    }

}

export default Booking;