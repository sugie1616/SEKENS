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
