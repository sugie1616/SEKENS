#!/usr/local/bin/konoha

using konoha.uuid.*;
using konoha.sql.*;
include "settings.k"
include "SEKENS.k";

OUT << "Content-Type: text/plain" << EOL << EOL;

class Register
{
	String qStr;
	String userName;
	String password;

	Register() {
		_qStr = $env.QUERY_STRING;
		String[] map = qStr.split("&");
		_userName = map[1].replace("username=", "");
		_password = map[2].replace("password1=", "");
	}

	void registerUser(SEKENS sks) {
		if (sks.checkReg(userName) == NG) {
			OUT << "Register failed" << EOL;
		}
		else {
			String dbq = "insert into user values('";
			dbq += userName + "' , '" + password + "' , '');";
			OUT << dbq << EOL;
			sks.con.exec(dbq);
			OUT << "Register completed" << EOL;
		}
	}
}

void main() {
	SEKENS sks = new SEKENS();
	Register reg = new Register();
	reg.registerUser(sks);
	sks.rSet.close();
	sks.con.close();
}
