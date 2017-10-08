#!/usr/bin/env ringo
const dates = require("ringo/utils/dates");
const strings = require("ringo/utils/strings");
const {command} = require("ringo/subprocess");
const system = require("system");

const Client = require("poststempel");

function main(args) {
    const TOKEN = args[0];
    const FROM  = args[1];
    const EMAIL = args[2];
    const DAYS  = parseInt(args[3]);
    const DOMAINS = args.slice(4);

    if (!TOKEN) {
        throw new Error("Server Token for Postmark API missing!");
    }

    if (!strings.isEmail(EMAIL)) {
        throw new Error("Destination e-mail address missing!");
    }

    if (DOMAINS.length === 0) {
        throw new Error("No domains to check!");
    }

    if (isNaN(DAYS) || DAYS <= 0) {
        throw new Error("Days must be >= 1!");
    }

    let allOK = true;
    let html = '<pre>';
    DOMAINS.forEach(function(domain) {
        const out = command("sh", module.resolve("./checkCert.sh"), domain, (60 * 60 * 24 * DAYS));
        if ((out || "").trim() === "ok") {
            html += '<span style="color: green;">OK   => ' + domain + '</span>\n';
        } else {
            allOK = false;
            html += '<span style="color: red;">FAIL => ' + domain + '</span>\n';
        }
    });
    html += "</pre><br><br>Finished at " + dates.format(new Date(), "YYYY-MM-dd HH:mm");
    
    const postmarkClient = new Client(TOKEN);
    let response = postmarkClient.sendEmail({
        "From": FROM,
        "To": EMAIL,
        "Subject": (allOK === true ? "" : "[WARNING] ") + "SSL Certificate Checks - " + dates.format(new Date(), "YYYY-MM-dd"),
        "HtmlBody": html
    });

    system.exit(0);
};

if (require.main === module) {
    main(system.args.slice(1));
}
