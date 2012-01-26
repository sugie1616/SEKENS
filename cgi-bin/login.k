#!/usr/local/bin/konoha

using konoha.json.*;

OUT << "Content-Type: text/plain" << EOL << EOL;
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

	void login(SEKENS sks) {
		if (sks.checkLog(userName, password) == true) {
			String sid = sks.generateSid();
			sks.saveSID(userName, sid);
			sks.saveCookie("SID", sid);

			OUT << "Content-Type: text/html\n" << EOL << EOL;

			Json j = new Json();
			j["SID"] = sid;
			OUT << j.stringify() << EOL;

			print $env.HTTP_COOKIE;
		}
		else {
			OUT << "PLEASE RETAKE" << EOL;
		}
	}
}

void main() {
	SEKENS sks = new SEKENS();
	LoginManager loginMan = new LoginManager();
	loginMan.login(sks);
}
