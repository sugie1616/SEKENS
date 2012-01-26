#!/usr/local/bin/konoha

using konoha.uuid.*;
using konoha.sql.*;
include "settings.k";
include "cgi.k";

class SEKENS
{
	String html = """
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
	</html>""";
	Connection con;
	ResultSet rSet;

	SEKENS() {
		_con = new Connection(G_USER_DB);
	}

	void saveCookie(String key, String val) {
		Cookie cookie = new Cookie();
		cookie[key] = val;
		cookie[key]["path"] = "/";
		OUT << cookie.dump();
	}
	
	void deleteCookie(String key) {
		Cookie cookie = new Cookie();
		cookie.delete(key);
		OUT << cookie.dump();
	}

	String generateSid() {
		return Uuid.getUuid4();
	}

	boolean checkReg(String userName) {
		rSet = con.query("select * from user");
		boolean recog = true;
		while (rSet.next()) {
			if (userName == rSet.getString("NAME")) {
				recog = false;
				break;
			}
		}
		return recog;
	}
	
	boolean checkLog(String userName, String password) {
		rSet = con.query("select * from user where name = '" + userName + "';");
		boolean recog = false;
		while (rSet.next()) {
			if (password == rSet.getString("PASSWORD")) {
				recog = true;
				break;
			}
		}
		return recog;
	}
	
	void saveSID(String userName, String sid) {
		String dbq = "update user set sid = '";
		dbq += sid + "' where name = '" + userName + "';";
		//OUT << dbq << EOL;
		con.exec(dbq);
	}
	
	void deleteSID(String userName) {
		String dbq = "update user set sid = ''";
		dbq += " where name = '" + userName + "';";
		//OUT << dbq << EOL;
		con.exec(dbq);
	}

	@Static void checkSID () {
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
