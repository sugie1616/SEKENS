#!/usr/local/bin/konoha

using konoha.uuid.*;
using konoha.sql.*;
using konoha.json.*;
using konoha.posix.*;
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
			<!-- sekens style sheet -->
			<link rel="stylesheet" type="text/css" href="../css/sekens.css" />
			<link rel="stylesheet" type="text/css" href="../libs/ext-4.0.7/resources/css/ext-all.css"/>
			<script type="text/javascript" src="../libs/ext-4.0.7/ext-all-debug.js"></script>
			<script type="text/javascript" src="../libs/ext-4.0.7/Ext.ux.panel.CodeMirror.js"></script>
			<!-- Loading CodeMirror Template files -->
			<script type="text/javascript" src="../libs/CodeMirror-2.0/lib/codemirror.js"></script>
			<!-- konoha.compiler.js -->
			<!--<script type="text/javascript" src="../js/konoha.js"></script>-->
			%jscode%
			<script type="text/javascript" src="../js/%script%"></script>
			<link rel="stylesheet" type="text/css" href="../libs/CodeMirror-2.0/lib/codemirror.css" />
			<!-- CodeMirror javascript mode -->
			<script http-equiv="content-script-type" content="text/javascript" src="../libs/CodeMirror-2.0/mode/javascript/javascript.js"></script>
			<link rel="stylesheet" type="text/css" href="../libs/CodeMirror-2.0/mode/javascript/javascript.css" />
		</head>
		<body>
		</body>
	</html>""";
	Connection con;
	ResultSet rSet;

	SEKENS() {
		_con = new Connection(G_USER_DB);
	}

	@Static String saveCookie(String key, String val) {
		Cookie cookie = new Cookie();
		cookie[key] = val;
		cookie[key]["path"] = "/";
		return cookie.dump();
	}
	
	@Static String deleteCookie(String key) {
		Cookie cookie = new Cookie();
		cookie.delete(key);
		return cookie.dump();
	}

	@Static String generateSid() {
		return Uuid.getUuid4();
	}

	boolean checkReg(String userName) {
		rSet = con.query("select * from user where name = '" + userName + "';");
		return rSet.next();
	}
	
	boolean checkLog(String userName, String password) {
		rSet = con.query("select * from user where name = '" + userName + "';");
		boolean recog = false;
		while (rSet.next()) {
			if (password == rSet.getString("password")) {
				recog = true;
				break;
			}
		}
		return recog;
	}
	
	boolean saveSID(String userName, String sid) {
		String dbq = "update user set sid = '";
		dbq += sid + "' where name = '" + userName + "';";
		con.exec(dbq);
		OutputStream tmpsid = new OutputStream(G_TMP_DIR + sid);
		Json j = new Json();
		j["username"] = userName;
		tmpsid.println(j.stringify());
		tmpsid.close();
		return true;
	}
	
	boolean deleteSID(String userName) {
		String dbq = "select sid from user where name = '" + userName + "';";
		rSet = con.query(dbq);
		rSet.next();
		String sid = rSet.getString("sid");
		String dbq = "update user set sid = ''";
		dbq += " where name = '" + userName + "';";
		con.exec(dbq);
		exec("rm -f " + G_TMP_DIR + sid);
		return true;
	}

	@Static Json checkSID(String sid) {
		InputStream tmpsid = new InputStream(G_TMP_DIR + sid);
		String s = tmpsid.readLine();
		if (s != null) {
			return Json.parse(s);
		}
		return null;
	}

	@Static boolean existsSID(String sid) {
		InputStream tmpsid = new InputStream(G_TMP_DIR + sid);
		return (tmpsid != null);
	}

	/* added by Wakamori */
	@Static boolean saveScript(Path path, String body) {
		OutputStream ous = new OutputStream(path);
		ous.println(body);
		ous.flush();
		ous.close();
		return true;
	}

	/* added by Wakamori */
	@Static String loadScript(Path path) {
		InputStream ins = new InputStream(path);
		return ins.read().decode();
	}

	@Static String err2json(String errtxt) {
		Json j = new Json();
		j["error"] = errtxt;
		return j.stringify();
	}
}

class LoginManager
{
	String userName;
	String password;
	String sid;

	LoginManager() {
		Cgi cgi = new Cgi();
		_userName = cgi.params["username"];
		_password = cgi.params["password"];
		if (cgi.cookies["SID"] != null) {
			_sid = cgi.cookies["SID"]["val"];
		}
	}

	String login(SEKENS sks) {
		if (sks.checkLog(userName, password) == true) {
			String sid = sks.generateSid();
			sks.saveSID(userName, sid);
			return sid;
		}
		return null;
	}

	boolean logout(SEKENS sks) {
		if (sid == null) return true;
		Json j = sks.checkSID(sid);
		userName = j["username"];
		return sks.deleteSID(userName);
	}
}
