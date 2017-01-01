/**
 * Created by Chen on 19/10/2016.
 */

var mailService     = require('../mail');

/***********
 * Public
 ***********/
module.exports = {
    sendFeedback: sendFeedback
}

/***********
 * Private
 ***********/
function sendFeedback(req, res) {
    var data = req.body.data;

    if (!data.content)
        return; // todo write error to log

    mailService.sendFeedbackMail(data);
    return res.send("success");
}