#!/usr/local/bin/konoha

using konoha.uuid.*;
using konoha.cookie.*;
using konoha.sql.*;

USER_NAME = "";
USER_SID = "";
USER_GIT_REPO_DIR = "";
CURRENT_DIR = "";
EDIT_FILE_NAME = "";
PAST_DATE = "Thu, 01 Jan 1970 00:00:00 GMT";

class SEKENS
{
	void saveCookie(String key, String val) {
		cookie = new Cookie();
		cookie[key] = val;
		cookie[key]["expires"] = "Thu, 28 Feb 2012 00:00:00 GMT";
		cookie[key]["path"] = "/";
		OUT << cookie.dump();
	}
	
	void deleteCookie(String key) {
		Cookie cookie = new Cookie();
		cookie[key] = "";
		cookie[key]["path"] = "/";
		cookie[key]["expires"] = PAST_DATE;
	}

	String generateSid() {
		return Uuid.getUuid4();
	}
	
	void setSID(String userName, String sid) {
		Connection con = new Connection("/var/www/html/SEKENS/cgi-bin/users/users.sqlite3");
		String dbq = "update user set sid = '";
		dbq += sid + "' where name = '" + userName + "';";
		con.exec(dbq);
		print dbq;
	}
}
