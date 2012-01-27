#!/usr/local/bin/konoha

OUT << "Content-Type: text/plain" << EOL << EOL;
include "settings.k";
include "SEKENS.k";

class LoginManager
{
	String qStr;
	String userName;
	String password;

	LoginManager() {
		_qStr = $env.QUERY_STRING;
		String[] map = qStr.split("&");
		_userName = map[1].replace("username=", "");
		_password = map[2].replace("password1=", "");
	}
	
	void login(SEKENS sks) {
		if (sks.checkLog(userName, password) == OK) {
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
	sks.rSet.close();
	sks.con.close();
}
