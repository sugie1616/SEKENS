#!/usr/local/bin/konoha

using konoha.uuid.*;
using konoha.cookie.*;
using konoha.sql.*;
using konoha.json.*;

USER_NAME = "";
USER_SID = "";
USER_FILE = "../resources/users/users.sqlite3";
USER_GIT_REPO_DIR = "";
CURRENT_DIR = "";
EDIT_FILE_NAME = "";
PAST_DATE = "Thu, 01 Jan 1970 00:00:00 GMT";
HTML = """
	<!DOCTYPE html>
	<html lang="ja">
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
			<title>SEKENS</title>
			<link rel="stylesheet" type="text/css" href="../ext-4.0.7/resources/css/ext-all.css"/>
			<link rel="stylesheet" type="text/css" href="../ext-4.0.7/examples/shared/example.css"/>
			<link rel="stylesheet" type="text/css" href="../resources/peers.css"/>
			<link rel="stylesheet" type="text/css" href="../ext-4.0.7/examples/ux/DataView/DragSelector.css" />
			<script type="text/javascript" src="../ext-4.0.7/bootstrap.js"></script>
			<script type="text/javascript" src="../jssrc/top.js"></script>
		</head>
		<body>
		</body>
	</html>"""

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
		Connection con = new Connection(USER_FILE);
		String dbq = "update user set sid = '";
		dbq += sid + "' where name = '" + userName + "';";
		con.exec(dbq);
		//print dbq;
	}
	
	void deleteSID(String userName) {
		Connection con = new Connection(USER_FILE);
		String dbq = "update user set sid = '";
		dbq += "' where name = '" + userName + "';";
		con.exec(dbq);
		//print dbq;
	}
}
