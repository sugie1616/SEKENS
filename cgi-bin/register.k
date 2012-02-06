#!/usr/local/bin/konoha

/*
 * register.k - user registration script
 *
 * @protocol POST
 * @param username				username
 * @param password				password
 * @return json['result']		result message
 * @return json['error']		error message
 */

include "SEKENS.k";

class Register
{
	String userName;
	String password;

	Register() {
		Cgi cgi = new Cgi();
		_userName = cgi.params["username"];
		_password = cgi.params["password"];
	}

	boolean registerUser(SEKENS sks) {
		if (sks.checkReg(userName)) {
			return false;
		}
		else {
			String dbq = "insert into user values('";
			dbq += userName + "' , '" + password + "' , '');";
			sks.con.exec(dbq);
		}
		return true;
	}

	boolean createUserDir() {
		String userdir = G_USER_DIR + userName;
		if (mkdir(userdir, 0775)) {
			String tmpdir = userdir + "/Repository";
			return mkdir(tmpdir, 0775);
		}
		return false;
	}
}

void main() {
	OUT << "Content-Type: application/json;charset=UTF-8\n" << EOL;
	SEKENS sks = new SEKENS();
	Register reg = new Register();
	Json j = new Json();
	if (reg.registerUser(sks) == false) {
		j["error"] = "username '" + reg.userName + "' is already exists";
		OUT << j.stringify() << EOL;
		return;
	}
	if (reg.createUserDir() == false) {
		j["error"] = "create user directory failed";
		OUT << j.stringify() << EOL;
		return;
	}
	j["result"] = "Register succeeded";
	OUT << j.stringify() << EOL;
}
