#!/usr/local/bin/konoha

/*
 * logout.k - logout and remove SID on server
 *
 * @protocol POST
 * @param cookie['SID']		sid
 * @return json['result']	result message
 * @return json['error']	error message
 */

include "SEKENS.k";

void main() {
	OUT << "Content-Type: application/json;charset=UTF-8\n" << EOL;
	SEKENS sks = new SEKENS();
	LoginManager loginMan = new LoginManager();
	Json j = new Json();
	if (loginMan.logout(sks)) {
		j["result"] = "Logout successed";
	} else {
		j["error"] = "Failed to logout";
	}
	OUT << j.stringify() << EOL;
}
