#!/usr/local/bin/konoha

using konoha.sql.*;

OUT << "Content-Type: text/plain" << EOL << EOL;

boolean doubly = false; //true = doubling
Connection con = new Connection("./users/users.sqlite3");
ResultSet rSet = con.query("select * from user");

String qStr = $env.QUERY_STRING;
String[] map = qStr.split("&");
String uName = map[1].replace("username=", "");
String password = map[2].replace("password1=", "");
OUT << uName << EOL;
OUT << password << EOL;

while (rSet.next()) {
	if (uName == rSet.getString("NAME") && password == rSet.getString("PASSWORD")) {
		doubly = true;
		break;
	}
}

if (doubly == true) {
	print "Login completed";
	/*
		
	*/
}
else {
	print "Login failed";
	/*
		
	*/
}

rSet.close();
con.close();
