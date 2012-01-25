#!/usr/local/bin/konoha

using konoha.uuid.*;
using konoha.sql.*;
include "SEKENS.k";

OUT << "Content-Type: text/plain" << EOL << EOL;

class Register
{

	String qStr;
	String uName;
	String password;
	String usr_file = "../resources/users/users.sqlite3";
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

	boolean regCheck() {
		boolean doubly = false;
		while (rSet.next()) {
			if (uName == rSet.getString("NAME")) {
				doubly = true;
				break;
			}
		}
		return doubly;
	}

	void registerUser(boolean doubly) {
		if (doubly == true) {
			OUT << "Register failed" << EOL;
		}
		else {
			String dbq = "insert into user values('";
			dbq += uName + "' , '" + password + "');";
			con.exec(dbq);
			OUT << "Register completed" << EOL;
		}
	}
}

void main() {
	Register reg = new Register();
	reg.registerUser(reg.regCheck());
	reg.rSet.close();
	reg.con.close();
}
