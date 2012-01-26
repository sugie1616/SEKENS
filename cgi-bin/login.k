#!/usr/local/bin/konoha

OUT << "Content-Type: text/plain" << EOL << EOL;
include "SEKENS.k";

class LoginManager
{
	String qStr;
	String uName;
	String password;
	ResultSet rSet;
	Connection con;

	LoginManager() {
		_qStr = $env.QUERY_STRING;
		String[] map = qStr.split("&");
		_uName = map[1].replace("username=", "");
		_password = map[2].replace("password1=", "");
		_con = new Connection(USER_FILE);
		_rSet = con.query("select * from user");
	}

	boolean loginCheck() {
		boolean doubly = false;
		while (rSet.next()) {
			if (uName == rSet.getString("NAME") && password == rSet.getString("PASSWORD")) {
				doubly = true;
				break;
			}
		}
		return doubly;
	}
	
	void login(String userName) {
		if (loginCheck() == true) {
			//OUT << "OK" << EOL;
			SEKENS sekens = new SEKENS();
			String sid = sekens.generateSid();
			sekens.saveSID(userName, sid);
			sekens.saveCookie("SID", sid);
			
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
	LoginManager loginMan = new LoginManager();
	loginMan.login(loginMan.uName);
	loginMan.rSet.close();
	loginMan.con.close();
}
