var express = require("express");
var app = express();
var request = require("request");

app.use(express.static("assets"));

var step = 0;
var error = 0;
var resent = 0;
var ownernum = "8688624136";
var authKey = "20145643";
var message = " ";
var clue = " ";
var phone = " ";
var key = " ";
var pkey = " ";
var name = "Rashmith";
var keyLen = 0;
var final = "Your gift is in the cupboard in conference room";

var keys = {
    1: "289764",
    2: "513012",
    3: "819677",
    4: "007662",
    // 5: "+8688624136355408",
    // 6: "916703",
    // 7: "384221",
    // 8: "164550",
    // 9: "+8688624136601920",
    // 10: "442139",
    // 11: "735291",
    // 12: "620097",
    // 13: "+8688624136100429",
    // 14: "843100",
    // 15: "+8688624136420957"
};
var clues = {
    1: "Check in your desk",
    2: "Check in the cupboard above the wash basin",
    4: "Check behind Rashmith's monitor",
    6: "Check under your keyboard",
    7: "Check in mini conference room's desk",
    8: "Check under Ramesh's CPU",
    10: "Check in HR room's desk",
    11: "Check under the speaker box in conference room",
    12: "Check under Vamshi's keyboard",
    14: "Check behind water cooler"
};

app.set("view engine", "ejs");
app.use(express.static("assets"));
app.use(express.static("public"));

for (var k in keys) {
    if (keys.hasOwnProperty(k)) {
        ++keyLen;
    }
}

app.get("/", function(req, res) {
    error = 0;
    resent = 0;
    res.render("home", { name: name, resent: resent, error: error, ownernum: ownernum });
});

app.get("/validate", function(req, res) {
    var validate = req.query.validate;
    if (validate == authKey) {
        step += 1;
        clue = clues[step];
        error = 0;
        res.render("clues", { error: error, clue: clue, phone: phone });
    }
    else {
        error = 1;
        resent = 0;
        res.render("home", { name: name, resent: resent, error: error, ownernum: ownernum });
    }
});

app.get("/next", function(req, res) {
    var password = req.query.password;
    key = keys[step];
    pkey = keys[step];

    if (key.slice(0, 1) == "+") {
        pkey = key.slice(11);
    }

    console.log(password, pkey, step, keyLen)
    if (step <= keyLen && password == pkey) {
        phone = " ";
        error = 0;
        step += 1;

        if (step <= keyLen) {
            pkey = keys[step];
            key = keys[step];
            if (clues[step]) {
                clue = clues[step];
            }
        }
        else {
            key = "rashmith";
        }

        if (key.slice(0, 1) == "+") {
            pkey = key.slice(11);
            phone = key.slice(1, 11);
            message = "Hi " + name + "," + "Your password " + step + " is:" + pkey;
            var url = "http://api.msg91.com/api/sendhttp.php?sender=" + name.slice(0, 7) +
                "&route=4&mobiles=" + phone + "&authkey=190019AjqeSZErl3Rj5a4389f2&country=91&message=" + message;
            clue = "Your password is sent to mobile: " + phone;
            request(url, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("Status Code is: " + response.statusCode)
                }
            });
        }

        if (step <= keyLen)
            res.render("clues", { step: step, error: error, clue: clue, phone: phone });
        else {
            res.render("congrats", { name: name, clue: final });
        }
    }
    else {
        error = 1;
        var clue = " ";
        res.render("clues", { step: step, error: error, clue: clue, phone: phone });
    }
});

app.get("/resend", function(req, res) {
    if (step == 0) {
        error = 0;

        message = "Hi " + name + "," + "Your authentication key is:" + authKey;
        var url = "http://api.msg91.com/api/sendhttp.php?sender=" + name.slice(0, 6) +
            "&route=4&mobiles=" + ownernum + "&authkey=190019AjqeSZErl3Rj5a4389f2&country=91&message=" + message;
        request(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {

            }
        });

        resent = 1;
        res.render("home", { name: name, error: error, resent: resent, ownernum: ownernum });
    }
    else {
        error = 0;
        phone = " ";
        key = keys[step];
        pkey = keys[step];

        if (key.slice(0, 1) == "+") {
            pkey = key.slice(11);
            phone = key.slice(1, 11);
            message = "Hi " + name + "," + "Your password " + step + " is:" + pkey;
            var url = "http://api.msg91.com/api/sendhttp.php?sender=" + name.slice(0, 6) +
                "&route=4&mobiles=" + phone + "&authkey=190019AjqeSZErl3Rj5a4389f2&country=91&message=" + message;
            clue = "Your password#" + step + " is resent to mobile: " + phone;
            request(url, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("Status Code is: " + response.statusCode)
                }
            });
        }

        res.render("clues", { error: error, clue: clue, phone: phone });
    }
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Guarding your treasure...");
});
