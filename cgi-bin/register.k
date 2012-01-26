#!/usr/local/bin/konoha

using konoha.uuid.*;
using konoha.sql.*;

OUT << "Content-Type: text/plain" << EOL << EOL;

class Register
{
	String qStr;
	String uName;
	String password;
	String usr_file = "/var/www/html/SEKENS/resources/users/users.sqlite3";
	Connection con;
	ResultSet rSet;

	Register() {
		_qStr = $env.QUERY_STRING;
		String[] map = qStr.split("&");
		_uName = map[1].replace("username=", "");
		_password = map[2].replace("password1=", "");
		_con = new Connection(usr_file);
		_rSet = con.query("select * from user");
	}

	boolean regCheck(ResultSet rSet) {
		boolean doubly = false;
		while (rSet.next()) {
			if (uName == rSet.getString("NAME")) {
				doubly = true;
				break;
			}
		}
		return doubly;
	}

	void registerUser(String uName, String password,boolean doubly) {
		if (doubly == true) {
			OUT << "Register failed" << EOL;
		}
		else {
			String dbq = "insert into user values('";
			dbq += uName + "' , '" + password + "' , '');";
			OUT << dbq << EOL;
			con.exec(dbq);
			OUT << "Register completed" << EOL;
		}
	}
}

void main() {
	Register reg = new Register();
	reg.registerUser(reg.uName, reg.password, reg.regCheck(reg.rSet));
	reg.rSet.close();
	reg.con.close();
}
