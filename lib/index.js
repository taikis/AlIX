"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gmail_1 = require("./gmail");
var fs = __importStar(require("fs"));
var csvParse = require("csv-parse/lib/sync");
var mailListData = fs.readFileSync("mail/mail_list.csv");
var mailList = csvParse(mailListData, {
    columns: true,
});
var mailBaseData = fs.readFileSync("mail/mail_base.txt");
var mailBase = mailBaseData.toString();
var regex = /\{(.+)\}/g;
mailList.forEach(function (mailData) {
    //全員に対して行う
    var thisMail = mailBase;
    while (true) {
        //mailBaseの中の全ての文字列を置換する
        var regexResult = regex.exec(mailBase);
        var keyword = regexResult;
        if (regexResult) {
            thisMail = thisMail.replace(regexResult[0], mailData[regexResult[1]]);
        }
        else {
            break;
        }
    }
    console.log(thisMail);
    console.log("--------------");
    (0, gmail_1.sendMessage)(mailData["MAIL_ADDRESS"], "test", thisMail);
});
