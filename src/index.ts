import { sendMessage } from "./gmail";
import * as fs from "fs";
import csvParse = require("csv-parse/lib/sync");
import readlineSync from "readline-sync";

interface MailList {
	[key: string]: any;
}

const mailListData = fs.readFileSync("mail/mail_list.csv");
const mailList: MailList[] = csvParse(mailListData, {
	columns: true,
});

const mailBaseData = fs.readFileSync("mail/mail_base.txt");
const mailBase: string = mailBaseData.toString();
const regex: RegExp = /\{(.+)\}/g;
var isFirstTime: boolean = true;
try {
	mailList.forEach((mailData) => {
		//全員に対して行う
		let thisMail: string = mailBase;
		while (true) {
			//mailBaseの中の全ての文字列を置換する
			const regexResult = regex.exec(mailBase);
			const keyword = regexResult;
			if (regexResult) {
				//置換
				if (!mailData[regexResult[1]]) {
					console.error(regexResult[1] + "がリストにありません。終了します。");
					throw 'No data in "mail_list.csv';
				}
				thisMail = thisMail.replace(regexResult[0], mailData[regexResult[1]]);
			} else {
				break;
			}
		}
		if (!mailData["MAIL_ADDRESS"]) {
			console.error("MAIL_ADDRESS" + "がリストにありません。終了します。");
			throw 'No data in "mail_list.csv';
		}
		if (isFirstTime) {
			let question: string[] = ["Yes", "NO"];
			isFirstTime = false;
			console.log(
				"to\t : " +
					mailData["MAIL_ADDRESS"] +
					"\n" +
					"subject\t : " +
					"test" +
					"\n" +
					"text\t : " +
					thisMail +
					"\n"
			);
			const answer = readlineSync.keyInSelect(
				question,
				"\x1b[36m送信しますか？:\x1b[0m"
			);
			if (!(answer == 0)) {
				throw "User is not choosing YES";
			}
		}
		sendMessage(mailData["MAIL_ADDRESS"], "test", thisMail);
	});
} catch (e) {
	console.error(e);
}
