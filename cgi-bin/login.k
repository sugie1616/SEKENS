#!/usr/local/bin/konoha

/*
 * login.k - login and return SID
 *
 * @protocol POST
 * @param username			username
 * @param password			password
 * @return json['SID']		session ID
 * @return json['result']	result message
 * @return json['error']	error message
 */

include "SEKENS.k";

class LoginManager
{
	String userName;
	String password;

	LoginManager() {
		Cgi cgi = new Cgi();
		_userName = cgi.params["username"];
		_password = cgi.params["password"];
	}

	String login(SEKENS sks) {
		if (sks.checkLog(userName, password) == true) {
			String sid = sks.generateSid();
			sks.saveSID(userName, sid);
			sks.saveCookie("SID", sid);
			return sid;
		}
		return null;
	}
}

void main() {
	OUT << "Content-Type: application/json;charset=UTF-8\n" << EOL;
	SEKENS sks = new SEKENS();
	LoginManager loginMan = new LoginManager();
	String s = loginMan.login(sks);
	Json j = new Json();
	if (s == null) {
		j["error"] = "Failed to login";
	} else {
		j["SID"] = s;
		j["result"] = "Login successed";
	}
	OUT << j.stringify() << EOL;
}
