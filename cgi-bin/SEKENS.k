#!/usr/local/bin/konoha

using konoha.uuid.*;
using konoha.cookie.*;
using konoha.sql.*;
using konoha.json.*;
include "settings.k";

OK = true;
NG = false;
USER_NAME = "";
USER_SID = "";
USER_GIT_REPO_DIR = "";
CURRENT_DIR = "";
EDIT_FILE_NAME = "";
PAST_DATE = "Thu, 01 Jan 1970 00:00:00 GMT";
EXPIRES = "Thu, 28 Feb 2012 00:00:00 GMT";
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
			<script type="text/javascript" src="../jssrc/data.js"></script>
			<script type="text/javascript" src="../jssrc/top.js"></script>
		</head>
		<body>
		</body>
	</html>"""

class SEKENS
{
	Connection con;
	ResultSet rSet;

	SEKENS() {
		_con = new Connection(G_USER_DB);
		_rSet = con.query("select * from user");
	}

	void saveCookie(String key, String val) {
		cookie = new Cookie();
		cookie[key] = val;
		cookie[key]["expires"] = EXPIRES;
		cookie[key]["path"] = "/";
		//OUT << cookie.dump();
	}
	
	void deleteCookie(String key) {
		Cookie cookie = new Cookie();
		cookie[key] = "";
		cookie[key]["expires"] = PAST_DATE;
		cookie[key]["path"] = "/";
		OUT << cookie.dump();
	}

	String generateSid() {
		return Uuid.getUuid4();
	}

	boolean checkReg(String userName) {
		boolean recog = OK;
		while (rSet.next()) {
			if (userName == rSet.getString("NAME")) {
				recog = NG;
				break;
			}
		}
		return recog;
	}
	
	boolean checkLog(String userName, String password) {
		boolean recog = NG;
		while (rSet.next()) {
			if (userName == rSet.getString("NAME") && password == rSet.getString("PASSWORD")) {
				recog = OK;
				break;
			}
		}
		return recog;
	}
	
	void saveSID(String userName, String sid) {
		String dbq = "update user set sid = '";
		dbq += sid + "' where name = '" + userName + "';";
		print dbq;
		con.exec(dbq);
		//OUT << dbq << EOL;
	}
	
	void deleteSID(String userName) {
		String dbq = "update user set sid = '";
		dbq += "' where name = '" + userName + "';";
		con.exec(dbq);
		OUT << dbq << EOL;
	}
	
	void checkSID () {
		Cookie cookie = new Cookie($env.HTTP_COOKIE);
		if (cookie["SID"] == null) {
			/*
				session is time over
				page to login
			*/
		}
		else {
		}
		//print "SID checked";
	}

	/* added by Wakamori */
	@Static void saveScript(Path path, String body) {
		OutputStream ous = new OutputStream(path);
		ous << body;
		ous.flush();
		ous.close();
	}

	/* added by Wakamori */
	@Static String loadScript(Path path) {
		InputStream ins = new InputStream(path);
		String script = "";
		foreach (String line in ins) {
			script += line + "\n";
		}
		return script;
	}
}

SEKENS sekens = new SEKENS();
sekens.checkSID();
