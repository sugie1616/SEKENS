#!/usr/local/bin/konoha

include "SEKENS.k";

OUT << "Content-Type: text/plain" << EOL << EOL;

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
		_con = new Connection("users/users.sqlite3");
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
			sekens.setSID(userName, sid);
			sekens.saveCookie("SID", sid);
			
			OUT << "Content-Type: text/html" << EOL << EOL;
		}
		else {
			OUT << "PLEASE RETAKE" << EOL;
		}
	}

}

void main() {
	LoginManager lMan = new LoginManager();
	lMan.login(lMan.uName);
	lMan.rSet.close();
	lMan.con.close();
}
