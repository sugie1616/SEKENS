#!/usr/local/bin/konoha

using konoha.sql.*;
using konoha.cookie.*;

OUT << "Content-Type: text/plain" << EOL << EOL;

class LoginManager
{

	String qStr;
	String uName;
	String password;
	boolean doubly = false; //true = doubling
	ResultSet rSet;
	Connection con;
	Cookie cookie;

	LoginManager() {
		_qStr = $env.QUERY_STRING;
		String[] map = qStr.split("&");
		_uName = map[1].replace("username=", "");
		_password = map[2].replace("password1=", "");
		_con = new Connection("users/users.sqlite3");
		_rSet = con.query("select * from user");
	}

	void loginCheck() {
		while (rSet.next()) {
			if (uName == rSet.getString("NAME") && password == rSet.getString("PASSWORD")) {
				doubly = true;
				break;
			}
		}
	}
	
	void login() {
		if (doubly == true) {
			OUT << "OK" << EOL;
			//page change !!
		}
		else {
			OUT << "RETAKE" << EOL;
		}
	}

}

void main() {
	LoginManager lMan = new LoginManager();
	lMan.loginCheck();
	lMan.login();
	lMan.rSet.close();
	lMan.con.close();
}
