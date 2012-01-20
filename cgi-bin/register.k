#!/usr/local/bin/konoha

using konoha.uuid.*;
using konoha.sql.*;

OUT << "Content-Type: text/plain" << EOL << EOL;

class Register
{

	String qStr;
	String uName;
	String password;
	boolean doubly = false; //true = doubling
	Connection con;
	ResultSet rSet;

	Register() {
		_qStr = $env.QUERY_STRING;
		String[] map = qStr.split("&");
		_uName = map[1].replace("username=", "");
		_password = map[2].replace("password1=", "");
		_con = new Connection("users/users.sqlite3");
		_rSet = con.query("select * from user");
	}

	void check() {
		while (rSet.next()) {
			if (uName == rSet.getString("NAME")) {
				doubly = true;
				break;
			}
		}
	}

	void registerUser(boolean doubly) {
		if (doubly == true) {
			OUT << "Register failed" << EOL;
		}
		else {
			String dbq = "insert into user values('";
			dbq += uName + "' , '" + password + "');";
			//OUT << dbq << EOL;
			con.exec(dbq);
			OUT << "Register completed" << EOL;
		}
		print doubly;
	}
}

void main() {
	Register reg = new Register();
	reg.check();
	reg.registerUser();
	reg.rSet.close();
	reg.con.close();
}
