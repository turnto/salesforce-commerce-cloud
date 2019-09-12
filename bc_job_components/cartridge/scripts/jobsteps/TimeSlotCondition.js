/**
* Tests the time slot condition and returns a SUSPEND if the test failed; OK otherwise.
*/

var Status = require('dw/system/Status');
var Calendar = require('dw/util/Calendar');
var System = require('dw/system/System');

function testTimeSlot(args) {
    // time slot does not start before this time
    var startTime = args.startTime;
    // time slot does not end before this time
    var endTime = args.endTime;
    // the mode
    var mode = args.mode || 'WITHIN';

    // taking timezone offset into consideration
    var now = System.getCalendar();
    var timezoneOffset = now.get(Calendar.ZONE_OFFSET);
    // var timezoneOffset = 0;

    var nowM = now.getTime().getTime();
    var startM = startTime.getTime() - timezoneOffset;
    var endM = endTime.getTime() - timezoneOffset;

    startTime.setTime(startM);
    endTime.setTime(endM);

    // x-day time slot
    if (startM > endM) {
        // adding a full day in milliseconds
        endM += 24 * 60 * 60 * 1000;
    }

    var withinTimeSlot = startM < nowM && nowM < endM;

    // default exit code
    var endNodeName = 'OK';

    // suspend exit code
    if (withinTimeSlot && mode !== 'WITHIN') {
        endNodeName = 'SUSPEND';
    }
    return new Status(Status.OK, endNodeName);
}

/*
 * Job exposed methods
 */
exports.testTimeSlot = testTimeSlot;
