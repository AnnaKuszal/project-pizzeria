class BaseWidget{
    constructor(wrapperElement, initialValue){
        thisWidget = this;

        thisWidget.dom = {};
        thisWidget.dom.wrapper = wrapperElement;

        thisWidget.value = initialValue;
    }
}

export default BaseWidget;