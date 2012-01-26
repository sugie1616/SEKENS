#!/usr/local/bin/konoha

using konoha.posix.*;
include "SEKENS.k";

OUT << "Content-Type: text/plain" << EOL << EOL;

class Register
{
	String userName;
	String password;

	Register() {
		Cgi cgi = new Cgi();
		_userName = cgi.params["username"];
		_password = cgi.params["password"];
	}

	void registerUser(SEKENS sks) {
		if (sks.checkReg(userName) == false) {
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

	void createUserDir() {
		String userdir = G_USER_DIR + userName;
		if (mkdir(userdir, 0775) == false) {
			OUT << "createdir failed" << EOL;
		}
	}
}

void main() {
	SEKENS sks = new SEKENS();
	Register reg = new Register();
	reg.registerUser(sks);
	reg.createUserDir();
}
